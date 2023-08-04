import { useEffect, useRef, useState } from 'react';

import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import removeAccents from 'remove-accents';

import { ActiveBadge } from '~/components/Badge/ActiveBadge';
import { PatentBadge } from '~/components/Badge/PatentBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { PlayerModal, PlayerModalHandle } from '~/components/Modal/PlayerModal';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import { usePlayers } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';

interface IPlayersProps extends GetServerSideProps {
  user: User;
}

const Players: NextPage<IPlayersProps> = ({ user }) => {
  const playerModalRef = useRef<PlayerModalHandle>(null);

  const { data, isLoading, isFetching } = usePlayers(user.id);

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        (player) => removeAccents(player.name.toLowerCase()).includes(removeAccents(search.toLowerCase()))
          || removeAccents(player.username.toLowerCase()).includes(removeAccents(search.toLowerCase())),
      ),
    );
  }, [search, data]);

  function handleShowModal(id?: string) {
    playerModalRef.current?.onOpenModal({
      id,
      user,
    });
  }

  const columns: ColumnDef<IPlayerAPI>[] = [
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
    {
      accessorKey: 'active',
      header: 'Status',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <ActiveBadge active={row.original.active} />,
    },
  ];

  return (
    <>
      <Head>
        <title>Jogadores - CS Manager</title>
      </Head>
      <PlayerModal ref={playerModalRef} />
      <Template user={user}>
        <Card>
          <CardHeader title="Jogadores" isFetching={isFetching && !isLoading}>
            <AddIconButton onClick={() => handleShowModal()} />
          </CardHeader>
          <CardBody>
            <SearchBar onSearch={(value) => setSearch(value)} isDisabled={isFetching} />
            <Table
              data={dataFiltered}
              columns={columns}
              isLoading={isLoading}
              onRowClick={({ id }) => handleShowModal(id)}
            />
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default Players;

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
