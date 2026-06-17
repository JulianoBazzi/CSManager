import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Providers } from '~/app/providers';

export const metadata: Metadata = {
  title: 'CS Manager',
  authors: [{ name: 'Bazzi Solutions' }],
  icons: { icon: '/favicon.webp' },
  openGraph: {
    type: 'website',
    images: '/favicon.webp',
    locale: 'pt_BR',
    siteName: 'CS Manager',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
