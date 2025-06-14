import { useEffect, useState } from 'react';

import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import removeAccents from 'remove-accents';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import type ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import { useSweepstakes } from '~/services/hooks/useSweepstakes';
import supabase from '~/services/supabase';

interface ISweepstakesProps extends GetServerSideProps {
  user: User;
}

const Sweepstakes: NextPage<ISweepstakesProps> = ({ user }) => {
  const router = useRouter();

  const { data, isLoading, isFetching } = useSweepstakes(user.id);

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        (sweepstake) => removeAccents(sweepstake.format_departure_at.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(sweepstake.format_short_game_type.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(sweepstake.format_game_type.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())),
      ),
    );
  }, [search, data]);

  function handleVisualization(id?: string) {
    if (id) {
      router.push(`/sweepstakes/${id}`);
      return;
    }

    router.push('/sweepstakes/new');
  }

  const columns: ColumnDef<ISweepstakeAPI>[] = [
    {
      accessorKey: 'format_departure_at',
      header: 'Data/Hora Sorteio',
      enableSorting: false,
    },
    {
      accessorKey: 'format_short_game_type',
      header: 'Jogo',
      enableSorting: false,
    },
    {
      accessorKey: 'format_engine',
      header: 'Engine',
      enableSorting: false,
    },
    {
      accessorKey: 'quantity_players',
      header: 'Nº Jogadores',
      enableSorting: false,
    },
    {
      accessorKey: 'quantity_maps',
      header: 'Nº Mapas',
      enableSorting: false,
    },
  ];

  return (
    <>
      <Head>
        <title>Sorteios - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title="Sorteios" isFetching={isFetching && !isLoading}>
            <AddIconButton onClick={() => handleVisualization()} />
          </CardHeader>
          <CardBody>
            <SearchBar onSearch={(value) => setSearch(value)} isDisabled={isFetching} />
            <Table
              data={dataFiltered}
              columns={columns}
              isLoading={isLoading}
              onRowClick={({ id }) => handleVisualization(id)}
            />
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default Sweepstakes;

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
