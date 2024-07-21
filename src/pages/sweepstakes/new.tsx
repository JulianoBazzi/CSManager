import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  Checkbox, Flex, Stack,
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
import { v4 } from 'uuid';
import * as yup from 'yup';
import { InferType } from 'yup';

import { games } from '~/assets/games';
import { sweepstakeEngines } from '~/assets/sweepstakeEngines';
import { MapBadge } from '~/components/Badge/MapBadge';
import { PremierBadge } from '~/components/Badge/PremierBadge';
import { StarBadge } from '~/components/Badge/StarBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { NumberInput } from '~/components/Form/NumberInput';
import { Select } from '~/components/Form/Select';
import { Table } from '~/components/Form/Table';
import { SweepstakeIconButton } from '~/components/IconButton/SweepstakeIconButton';
import Template from '~/components/Template';
import { TABLE_SWEEPSTAKE_MAPS, TABLE_SWEEPSTAKE_PLAYERS, TABLE_SWEEPSTAKES } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import IMapAPI from '~/models/Entity/Map/IMapAPI';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';
import ISweepstake from '~/models/Entity/Sweepstake/ISweepstake';
import { SeepstakeEngineEnum } from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import ISweepstakeMap from '~/models/Entity/Sweepstake/ISweepstakeMap';
import ISweepstakePlayer from '~/models/Entity/Sweepstake/ISweepstakePlayer';
import { SweepstakeTeamEnum } from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';
import ISelectOption from '~/models/ISelectOption';
import { useMaps } from '~/services/hooks/useMaps';
import { usePlayers } from '~/services/hooks/usePlayers';
import { getPlayersScoresOnMaps } from '~/services/hooks/usePlayerScoresOnMaps';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import balanceTeams from '~/utils/balanceTeams';
import randomUnique from '~/utils/randomUnique';

interface INewSweepstakeProps extends GetServerSideProps {
  user: User;
}

const NewSweepstake: NextPage<INewSweepstakeProps> = ({ user }) => {
  const { errorFeedbackToast, warningFeedbackToast, successFeedbackToast } = useFeedback();

  const [selectedPlayers, setSelectedPlayers] = useState<IPlayerAPI[]>([]);
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);

  const { data: players, isLoading: isLoadingPlayers } = usePlayers(user.id, { active: true });
  const { data: maps, isLoading: isLoadingMaps } = useMaps(user.id, { active: true });

  function handleSelectedPlayers(value: IPlayerAPI) {
    const find = selectedPlayers.find((player) => player.id === value.id);
    if (find) {
      setSelectedPlayers((previousPlayers) => previousPlayers.filter((player) => player.id !== value.id));
    } else {
      setSelectedPlayers((previousPlayers) => [...previousPlayers, value]);
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
      mutationFn: async ({ game_type, departure_at, engine }: ISweepstake) => {
        const sweepstakeId = v4();
        const playerList: ISweepstakePlayer[] = [];

        let divisionTeams: [IPlayerScoreAPI[], IPlayerScoreAPI[]] = [[], []];

        if (engine?.id === SeepstakeEngineEnum.Ranking) {
          const playerScoreList = await getPlayersScoresOnMaps(
            selectedPlayers.map((player) => player.id),
            selectedMaps,
            user?.id,
          );

          if (playerScoreList) {
            divisionTeams = balanceTeams(playerScoreList.map((item) => ({
              id: item.id,
              rating: item.rating,
              score: item.score,
            })));
          }
        } else {
          divisionTeams = balanceTeams(selectedPlayers.map((player) => ({
            id: player.id,
            rating: player.rating,
            score: player.premier,
          })));
        }

        for (let i = 0; i < divisionTeams.length;) {
          divisionTeams[i].forEach((player) => {
            playerList.push({
              user_id: user?.id,
              sweepstake_id: sweepstakeId,
              player_id: player.id,
              team: i,
              score: player.score,
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
          engine: engine?.id,
          departure_at,
          quantity_players: playerList.length,
          quantity_maps: mapList.length,
          score_team_one: playerList.filter((player) => player.team === SweepstakeTeamEnum.One).reduce((sum, player) => sum + player.score, 0),
          score_team_two: playerList.filter((player) => player.team === SweepstakeTeamEnum.Two).reduce((sum, player) => sum + player.score, 0),
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
          isChecked={!!selectedPlayers.find((player) => player.id === row.original.id)}
          onChange={() => handleSelectedPlayers(row.original)}
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
    {
      accessorKey: 'rating',
      header: 'Avaliação',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <StarBadge rating={row.original.rating} />,
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
    engine: yup
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
      engine: sweepstakeEngines.find((engine) => engine.id === user.user_metadata.sweepstakeEngine),
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
              <Select
                label="Método de Sorteio"
                options={sweepstakeEngines}
                value={watch('engine') as ISelectOption}
                error={errors.engine?.id}
                {...register('engine')}
                isDisabled={isLoadingCreate}
                isRequired
                onChange={(option) => {
                  setValue('engine', option);
                }}
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
              <Table
                data={players}
                columns={playerColumns}
                isLoading={isLoadingPlayers}
                onRowClick={(value) => handleSelectedPlayers(value)}
              />
            </CardBody>
          </Card>
          <Card w={['100%', '40%']}>
            <CardHeader title="Mapas" />
            <CardBody>
              <Table
                data={maps}
                columns={mapColumns}
                isLoading={isLoadingMaps}
                onRowClick={({ id }) => handleSelectedMaps(id)}
              />
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
