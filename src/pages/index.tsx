import Head from 'next/head';

import Template from '~/components/Template';

export default function Home() {
  return (
    <>
      <Head>
        <title>CS Manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Template />
    </>
  );
}
