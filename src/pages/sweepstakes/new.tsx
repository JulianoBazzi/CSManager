import { SubmitHandler, useForm } from 'react-hook-form';

import { Flex, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import * as yup from 'yup';

import { games } from '~/assets/games';
import { MapBadge } from '~/components/Badge/MapBadge';
import { PatentBadge } from '~/components/Badge/PatentBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { NumberInput } from '~/components/Form/NumberInput';
import { Select } from '~/components/Form/Select';
import { Table } from '~/components/Form/Table';
import { SweepstakeIconButton } from '~/components/IconButton/SweepstakeIconButton';
import Template from '~/components/Template';
import IMapAPI from '~/models/Entity/Map/IMapAPI';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import ISweepstake from '~/models/Entity/Sweepstake/ISweepstake';
import { useMaps } from '~/services/hooks/useMaps';
import { usePlayers } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';

interface INewSweepstakeProps extends GetServerSideProps {
  user: User;
}

const NewSweepstake: NextPage<INewSweepstakeProps> = ({ user }) => {
  const { data: players, isLoading: isLoadingPlayers } = usePlayers(user.id);
  const { data: maps, isLoading: isLoadingMaps } = useMaps(user.id);

  const playerColumns: ColumnDef<IPlayerAPI>[] = [
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
      accessorKey: 'patent',
      header: 'Patente',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PatentBadge patent={row.original.patent} format_patent={row.original.format_patent} />,
    },
  ];

  const mapColumns: ColumnDef<IMapAPI>[] = [
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
    name: yup.string().min(3).required(),
    active: yup.boolean().required(),
    map_type: yup
      .object()
      .shape({
        id: yup.string().required(),
        name: yup.string(),
      })
      .nullable()
      .required(),
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
    formState: { errors, isSubmitting },
  } = useForm<Partial<ISweepstake>>({
    resolver: yupResolver(sweepstakeSchema),
    defaultValues: {
      game_type: games.find((game) => game.id === user.user_metadata.gameType),
      departure_at: dayjs().set('hour', 20).set('minute', 0).set('second', 0)
        .format('YYYY-MM-DD HH:mm:ss'),
      quantity_players: 0,
      quantity_maps: 0,
    },
  });

  const handleOk: SubmitHandler<Partial<ISweepstake>> = async (data) => {
    console.log('asadssd');
  };

  return (
    <>
      <Head>
        <title>Novo Sorteio - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title="Novo Sorteio">
            <SweepstakeIconButton type="submit" />
          </CardHeader>
          <CardBody>
            <Stack direction={['column', 'row']} spacing="4">
              <Select
                label="Jogo"
                options={games}
                value={watch('game_type')}
                error={errors.game_type?.id}
                {...register('game_type')}
                isDisabled={isSubmitting}
                isRequired
                onChange={(option) => {
                  setValue('game_type', option);
                }}
              />
              <Input
                type="datetime-local"
                label="Data/Hora da Partida"
                error={errors.departure_at}
                {...register('departure_at')}
                isDisabled={isSubmitting}
                isRequired
              />
              <NumberInput
                maxW={['100%', '150px']}
                label="Qtd. Jogadores"
                name="quantity_players"
                value={watch('quantity_players')}
                isDisabled
              />
              <NumberInput
                maxW={['100%', '150px']}
                label="Qtd. Mapas"
                name="quantity_maps"
                value={watch('quantity_maps')}
                isDisabled
              />
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
