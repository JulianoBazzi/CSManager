import { useEffect, useRef, useState } from 'react';

import { Flex } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import removeAccents from 'remove-accents';

import { ActiveBadge } from '~/components/Badge/ActiveBadge';
import { BooleanBadge } from '~/components/Badge/BooleanBadge';
import { LinkBadge } from '~/components/Badge/LinkBadge';
import { PremierBadge } from '~/components/Badge/PremierBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { RankingIconButton } from '~/components/IconButton/RankingIconButton';
import { RefreshIconButton } from '~/components/IconButton/RefreshIconButton';
import { PlayerMapRankingModal, PlayerMapRankingModalHandle } from '~/components/Modal/PlayerMapRankingModal';
import { PlayerModal, PlayerModalHandle } from '~/components/Modal/PlayerModal';
import { UpdatePlayerScoresModal, UpdatePlayerScoresModalHandle } from '~/components/Modal/UpdatePlayerScoresModal';
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
  const updatePlayerScoresModalRef = useRef<UpdatePlayerScoresModalHandle>(null);
  const playerMapRankingModalRef = useRef<PlayerMapRankingModalHandle>(null);

  const { data, isLoading, isFetching } = usePlayers(user.id);

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        (player) => removeAccents(player.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(player.username.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())),
      ),
    );
  }, [search, data]);

  function handleUpdateScorePlayersShowModal() {
    updatePlayerScoresModalRef.current?.onOpenModal({
      user,
    });
  }

  function handleShowModal(id?: string) {
    playerModalRef.current?.onOpenModal({
      id,
      user,
    });
  }

  function handleShowRankingModal(player: IPlayerAPI) {
    playerMapRankingModalRef.current?.onOpenModal({
      id: player.id,
      user,
      player,
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
      header: 'Username',
      enableSorting: false,
    },
    {
      accessorKey: 'actions',
      header: 'Steam ID',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <LinkBadge value={row.original.steam_id} link={`https://leetify.com/public/profile/${row.original.steam_id}`} />,
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
    },
    {
      accessorKey: 'fetch_data',
      header: 'Buscar Dados',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <BooleanBadge active={row.original.active} />,
    },
    {
      accessorKey: 'active',
      header: 'Status',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <ActiveBadge active={row.original.active} />,
    },
    {
      accessorKey: 'actions',
      header: '',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <RankingIconButton onClick={() => handleShowRankingModal(row.original)} size="xs" />,
    },
  ];

  return (
    <>
      <Head>
        <title>Jogadores - CS Manager</title>
      </Head>
      <PlayerModal ref={playerModalRef} />
      <UpdatePlayerScoresModal ref={updatePlayerScoresModalRef} />
      <PlayerMapRankingModal ref={playerMapRankingModalRef} />
      <Template user={user}>
        <Card>
          <CardHeader title="Jogadores" isFetching={isFetching && !isLoading}>
            <Flex gap="2">
              <RefreshIconButton onClick={() => handleUpdateScorePlayersShowModal()} />
              <AddIconButton onClick={() => handleShowModal()} />
            </Flex>
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
