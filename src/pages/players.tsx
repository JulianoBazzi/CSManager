import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';
import { useAuth } from '~/contexts/AuthContext';
import supabase from '~/services/supabase';

interface IPlayersProps extends GetServerSideProps {
  user?: User;
}

const Players: NextPage<IPlayersProps> = ({ user }) => {
  const { changePassword } = useAuth();

  return (
    <>
      <Head>
        <title>Jogadores - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title="Jogadores">
            <IconButton colorScheme="green" icon={<AddIcon />} aria-label="Adicionar" title="Novo Jogador"></IconButton>
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
