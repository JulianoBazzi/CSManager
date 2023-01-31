import { useEffect, useRef, useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import removeAccents from 'remove-accents';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { PlayerModal, PlayerModalHandle } from '~/components/Modal/PlayerModal';
import { SearchBar } from '~/components/SearchBar';
import { Table } from '~/components/Table';
import Template from '~/components/Template';
import ITableColumn from '~/models/ITableColumn';
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
        (player) =>
          removeAccents(player.name.toLowerCase()).includes(removeAccents(search)) ||
          removeAccents(player.username.toLowerCase()).includes(removeAccents(search))
      )
    );
  }, [search, data]);

  function handleAdd() {
    playerModalRef.current?.onOpenModal({
      userId: user.id,
    });
  }

  const columns: ITableColumn[] = [
    {
      header: 'Nome',
      field: 'name',
    },
    {
      header: 'Steam',
      field: 'username',
    },
    {
      header: 'Patente',
      field: 'patent',
    },
    {
      header: 'Ativo',
      field: 'active',
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
            <IconButton
              colorScheme="green"
              icon={<AddIcon />}
              aria-label="Novo"
              title="Novo Jogador"
              onClick={handleAdd}
            />
          </CardHeader>
          <CardBody>
            <SearchBar onSearch={(value) => setSearch(value)} isDisabled={isFetching} />
            <Table data={dataFiltered} columns={columns} isLoading={isLoading} />
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
        user: user,
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
