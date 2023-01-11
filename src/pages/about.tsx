import { Box, Divider, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Head from 'next/head';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';

export default function Home() {
  return (
    <>
      <Head>
        <title>CS Manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Template>
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
}
