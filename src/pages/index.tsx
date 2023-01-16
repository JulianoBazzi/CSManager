import { Text } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';
import supabase from '~/services/supabase';

interface IHomeProps extends GetServerSideProps {
  user?: User;
}

const Home: NextPage<IHomeProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>CS Manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title="Início" />
          <CardBody>
            <Text>Em Breve</Text>
            <div className="container" style={{ padding: '50px 0 100px 0' }}>
              {user ? <p>Account page will go here.</p> : <p>Not is session.</p>}
            </div>
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default Home;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { 'csm.token': token } = parseCookies(context);
    if (!token) {
      return {
        props: {},
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return {
        props: {},
      };
    }

    return {
      props: {
        user: user,
      },
    };
  } catch {
    return {
      props: {},
    };
  }
};
