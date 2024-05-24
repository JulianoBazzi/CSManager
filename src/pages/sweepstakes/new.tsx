import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  Checkbox, Flex, Stack, TableContainer,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { uuid } from 'uuidv4';
import * as yup from 'yup';
import { InferType } from 'yup';

import { games } from '~/assets/games';
import { MapBadge } from '~/components/Badge/MapBadge';
import { PremierBadge } from '~/components/Badge/PremierBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { NumberInput } from '~/components/Form/NumberInput';
import { Select } from '~/components/Form/Select';
import { Table } from '~/components/Form/Table';
import { SweepstakeIconButton } from '~/components/IconButton/SweepstakeIconButton';
import Template from '~/components/Template';
import { TABLE_SWEEPSTAKES, TABLE_SWEEPSTAKE_MAPS, TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import IMapAPI from '~/models/Entity/Map/IMapAPI';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import ISweepstake from '~/models/Entity/Sweepstake/ISweepstake';
import ISweepstakeMap from '~/models/Entity/Sweepstake/ISweepstakeMap';
import ISweepstakePlayer from '~/models/Entity/Sweepstake/ISweepstakePlayer';
import ISelectOption from '~/models/ISelectOption';
import { useMaps } from '~/services/hooks/useMaps';
import { usePlayers } from '~/services/hooks/usePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import randomUnique from '~/utils/randomUnique';
import splitArray from '~/utils/splitArray';

interface INewSweepstakeProps extends GetServerSideProps {
  user: User;
}

const NewSweepstake: NextPage<INewSweepstakeProps> = ({ user }) => {
  const { data: players, isLoading: isLoadingPlayers } = usePlayers(user.id, true);
  const { data: maps, isLoading: isLoadingMaps } = useMaps(user.id, true);
  const { errorFeedbackToast, warningFeedbackToast, successFeedbackToast } = useFeedback();

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);

  function handleSelectedPlayers(id: string) {
    const find = selectedPlayers.find((i) => i === id);
    if (find) {
      setSelectedPlayers((ids) => ids.filter((i) => i !== id));
    } else {
      setSelectedPlayers((ids) => [...ids, id]);
    }
  }

  function handleSelectedMaps(id: string) {
    const find = selectedMaps.find((i) => i === id);
    if (find) {
      setSelectedMaps((ids) => ids.filter((i) => i !== id));
    } else {
      setSelectedMaps((ids) => [...ids, id]);
    }
  }

  const { mutateAsync, isPending: isLoadingCreate } = useMutation(
    {
      mutationFn: async ({ game_type, departure_at }: ISweepstake) => {
        const sweepstakeId = uuid();
        const divisionTeams = splitArray(selectedPlayers);

        const playerList: ISweepstakePlayer[] = [];
        for (let i = 0; i < divisionTeams.length;) {
          divisionTeams[i].forEach((playerId) => {
            playerList.push({
              user_id: user?.id,
              sweepstake_id: sweepstakeId,
              player_id: playerId,
              team: i,
            });
          });

          i += 1;
        }

        const mapList: ISweepstakeMap[] = [];
        const startFromTerrorist = randomUnique(2, 1)[0] - 1;
        for (let i = 0; i < selectedMaps.length;) {
          mapList.push({
            user_id: user?.id,
            sweepstake_id: sweepstakeId,
            map_id: selectedMaps[i],
            team_start_from_terrorist: startFromTerrorist,
            team_one_score_1: 0,
            team_one_score_2: 0,
            team_two_score_1: 0,
            team_two_score_2: 0,
            order: i,
          });

          i += 1;
        }

        await supabase.from(TABLE_SWEEPSTAKES).insert({
          id: sweepstakeId,
          user_id: user.id,
          game_type: game_type?.id,
          departure_at,
          consider_patents: false,
          consider_previous_rankings: false,
          quantity_players: playerList.length,
          quantity_maps: mapList.length,
        });

        await supabase.from(TABLE_SWEEPSTAKE_PLAYERS).insert(playerList);

        await supabase.from(TABLE_SWEEPSTAKE_MAPS).insert(mapList);

        return sweepstakeId;
      },
      async onSuccess(id) {
        successFeedbackToast('Novo Sorteio', 'Sorteio realizado com sucesso!');
        await queryClient.invalidateQueries({ queryKey: [TABLE_SWEEPSTAKES] });
        await Router.push(`/sweepstakes/${id}`);
      },
      onError(error: Error) {
        errorFeedbackToast('Novo Sorteio', error);
      },
    },
  );

  const playerColumns: ColumnDef<IPlayerAPI>[] = [
    {
      accessorKey: 'id',
      header: '',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <Checkbox
          isChecked={!!selectedPlayers.find((id) => id === row.original.id)}
          onChange={() => handleSelectedPlayers(row.original.id)}
          isDisabled={isLoadingCreate}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      enableSorting: false,
    },
    {
      accessorKey: 'username',
      header: 'Steam',
      enableSorting: false,
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
    },
  ];

  const mapColumns: ColumnDef<IMapAPI>[] = [
    {
      accessorKey: 'id',
      header: '',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <Checkbox
          isChecked={!!selectedMaps.find((id) => id === row.original.id)}
          onChange={() => handleSelectedMaps(row.original.id)}
          isDisabled={isLoadingCreate}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      enableSorting: false,
    },
    {
      accessorKey: 'format_map_type',
      header: 'Categoria',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <MapBadge type={row.original.map_type} format_type={row.original.format_map_type} />,
    },
  ];

  const sweepstakeSchema = yup.object().shape({
    departure_at: yup.string().required(),
    game_type: yup
      .object()
      .shape({
        id: yup.string().required(),
        name: yup.string(),
      })
      .nullable()
      .required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sweepstakeSchema),
    defaultValues: {
      game_type: games.find((game) => game.id === user.user_metadata.gameType),
      departure_at: dayjs().set('hour', 21).set('minute', 0).set('second', 0)
        .format('YYYY-MM-DD HH:mm'),
    },
  });

  const handleOk: SubmitHandler<InferType<typeof sweepstakeSchema>> = async (data) => {
    if (selectedPlayers.length <= 1) {
      warningFeedbackToast('Novo Sorteio', 'É obrigatório selecionar ao menos dois jogadores.');
      return;
    }

    if (selectedMaps.length === 0) {
      warningFeedbackToast('Novo Sorteio', 'É obrigatório selecionar ao menos um mapa.');
      return;
    }

    await mutateAsync(data as ISweepstake);
  };

  return (
    <>
      <Head>
        <title>Novo Sorteio - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card as="form" onSubmit={handleSubmit(handleOk)}>
          <CardHeader title="Novo Sorteio">
            <SweepstakeIconButton type="submit" isLoading={isLoadingCreate} />
          </CardHeader>
          <CardBody>
            <Stack direction={['column', 'row']} spacing="4">
              <Select
                label="Jogo"
                options={games}
                value={watch('game_type') as ISelectOption}
                error={errors.game_type?.id}
                {...register('game_type')}
                isDisabled={isLoadingCreate}
                isRequired
                onChange={(option) => {
                  setValue('game_type', option);
                }}
              />
              <Input
                type="datetime"
                label="Data/Hora da Partida"
                error={errors.departure_at}
                {...register('departure_at')}
                isDisabled={isLoadingCreate}
                isRequired
              />
              <Stack direction="row" spacing="4" w="100%">
                <NumberInput
                  maxW={['100%', '150px']}
                  label="Qtd. Jogadores"
                  name="quantity_players"
                  value={selectedPlayers.length}
                  isDisabled
                />
                <NumberInput
                  maxW={['100%', '150px']}
                  label="Qtd. Mapas"
                  name="quantity_maps"
                  value={selectedMaps.length}
                  isDisabled
                />
              </Stack>
            </Stack>
          </CardBody>
        </Card>
        <Flex direction={['column', 'row']} w="100%" gap={['0', '2']}>
          <Card w={['100%', '60%']}>
            <CardHeader title="Jogadores" />
            <CardBody>
              <TableContainer>
                <Table
                  data={players}
                  columns={playerColumns}
                  isLoading={isLoadingPlayers}
                  onRowClick={({ id }) => handleSelectedPlayers(id)}
                />
              </TableContainer>
            </CardBody>
          </Card>
          <Card w={['100%', '40%']}>
            <CardHeader title="Mapas" />
            <CardBody>
              <TableContainer>
                <Table
                  data={maps}
                  columns={mapColumns}
                  isLoading={isLoadingMaps}
                  onRowClick={({ id }) => handleSelectedMaps(id)}
                />
              </TableContainer>
            </CardBody>
          </Card>
        </Flex>
      </Template>
    </>
  );
};

export default NewSweepstake;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { 'csm.token': token } = parseCookies(context);
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
