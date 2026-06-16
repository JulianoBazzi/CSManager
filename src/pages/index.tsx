import { Box, Link, List, Separator, Text } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
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

const Home: NextPage<IHomeProps> = ({ user }) => (
  <>
    <Head>
      <title>CS Manager</title>
    </Head>
    <Template user={user}>
      <Card>
        <CardHeader title="CS Manager" />
        <CardBody>
          <Box>
            <Text>Tecnologias Utilizadas:</Text>
            <List.Root mt="2">
              <List.Item>
                <Link href="https://nextjs.org">Next.js</Link>
              </List.Item>
              <List.Item>
                <Link href="https://www.typescriptlang.org">TypeScript</Link>
              </List.Item>
              <List.Item>
                <Link href="https://chakra-ui.com">Chakra UI</Link>
              </List.Item>
              <List.Item>
                <Link href="https://supabase.com">Supabase</Link>
              </List.Item>
            </List.Root>
          </Box>
          <Separator mt="-2" />
          <Box>
            <Text>Link do Projeto:</Text>
            <List.Root mt="2">
              <List.Item>
                <Link href="https://github.com/JulianoBazzi/CSManager">GitHub</Link>
              </List.Item>
            </List.Root>
          </Box>
        </CardBody>
      </Card>
    </Template>
  </>
);

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
        user,
      },
    };
  } catch {
    return {
      props: {},
    };
  }
};
