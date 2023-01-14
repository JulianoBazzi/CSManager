import { useEffect, useRef } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { PlayerModal, PlayerModalHandle } from '~/components/Modal/PlayerModal';
import Template from '~/components/Template';
import { usePlayers } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';

interface IPlayersProps extends GetServerSideProps {
  user: User;
}

const Players: NextPage<IPlayersProps> = ({ user }) => {
  const playerModalRef = useRef<PlayerModalHandle>(null);

  const { data, isLoading, isFetching } = usePlayers(user.id);

  useEffect(() => {
    console.log('players', data);
  }, [data]);

  function handleAdd() {
    playerModalRef.current?.onOpenModal({
      userId: user.id,
    });
  }

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
              aria-label="Adicionar"
              title="Novo Jogador"
              onClick={handleAdd}
            />
          </CardHeader>
          <CardBody>
            <Text>AKSOASDKASKOKS KO</Text>
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
