import { Text } from '@chakra-ui/react';
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
          <CardHeader title="Início" />
          <CardBody>
            <Text>Em Breve</Text>
          </CardBody>
        </Card>
      </Template>
    </>
  );
}
