import { ColorModeScript } from '@chakra-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import { theme } from '~/styles/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
          <meta name="author" content="Bazzi Solutions" />
          <meta httpEquiv="cache-control" content="no-cache" />
          <meta httpEquiv="expires" content="0" />
          <meta httpEquiv="pragma" content="no-cache" />
          <link rel="icon" href="/favicon.webp" />

          {/* Twitter */}
          {/* <meta property="twitter:description" content={`Faça seu pedido online com a ${NEXT_PUBLIC_TITLE}.`} /> */}
          <meta property="twitter:card" content="summary" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/favicon.webp" />
          {/* <meta property="og:description" content={`Faça seu pedido online com a ${NEXT_PUBLIC_TITLE}.`} /> */}
          <meta property="og:locale" content="pt_BR" />
          <meta property="og:site_name" content="CS Manager" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} storageKey="csm-color-mode" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
