import { QueryClientProvider } from 'react-query';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import * as Yup from 'yup';
import { ptShort } from 'yup-locale-pt';

import { AuthProvider } from '~/contexts/AuthContext';
import { FeedbackProvider } from '~/contexts/FeedbackContext';
import { queryClient } from '~/services/queryClient';
import { theme } from '~/styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  Yup.setLocale(ptShort);

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <FeedbackProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </FeedbackProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
