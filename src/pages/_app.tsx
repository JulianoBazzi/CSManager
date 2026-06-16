import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import * as Yup from 'yup';
import { ptShort } from 'yup-locale-pt';

import { Toaster } from '~/components/Toaster';
import { AuthProvider } from '~/contexts/AuthContext';
import { FeedbackProvider } from '~/contexts/FeedbackContext';
import { queryClient } from '~/services/queryClient';
import { system } from '~/styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  Yup.setLocale(ptShort);
  Yup.setLocale({ mixed: { notType: 'Valor inválido.' } });

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <FeedbackProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </FeedbackProvider>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
