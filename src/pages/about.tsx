import { Box, Divider, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';
import supabase from '~/services/supabase';

interface IAboutProps extends GetServerSideProps {
  user?: User;
}

const About: NextPage<IAboutProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Sobre - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title="Sobre" />
          <CardBody>
            <Box>
              <Text>Tecnologias Utilizadas:</Text>
              <UnorderedList mt="2">
                <ListItem>
                  <Link href="https://nextjs.org">Next.js</Link>
                </ListItem>
                <ListItem>
                  <Link href="https://www.typescriptlang.org">TypeScript</Link>
                </ListItem>
                <ListItem>
                  <Link href="https://chakra-ui.com">Chakra UI</Link>
                </ListItem>
                <ListItem>
                  <Link href="https://supabase.com">Supabase</Link>
                </ListItem>
              </UnorderedList>
            </Box>
            <Divider mt="-2" />
            <Box>
              <Text>Link do Projeto:</Text>
              <UnorderedList mt="2">
                <ListItem>
                  <Link href="https://github.com/JulianoBazzi/CSManager">GitHub</Link>
                </ListItem>
              </UnorderedList>
            </Box>
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default About;

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
