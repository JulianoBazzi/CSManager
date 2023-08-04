import { ColorModeScript } from '@chakra-ui/react';
import Document, {
  Head, Html, Main, NextScript,
} from 'next/document';

import { theme } from '~/styles/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="author" content="Bazzi Solutions" />
          <link rel="icon" href="/favicon.webp" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/favicon.webp" />
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
