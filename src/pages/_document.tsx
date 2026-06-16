import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
