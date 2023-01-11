import { useState } from 'react';
import { QueryClientProvider } from 'react-query';

import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import * as Yup from 'yup';
import { ptShort } from 'yup-locale-pt';

import { AuthProvider } from '~/contexts/AuthContext';
import { FeedbackProvider } from '~/contexts/FeedbackContext';
import { queryClient } from '~/services/queryClient';
import { theme } from '~/styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  Yup.setLocale(ptShort);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <QueryClientProvider client={queryClient}>
          <FeedbackProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </FeedbackProvider>
        </QueryClientProvider>
      </SessionContextProvider>
    </ChakraProvider>
  );
}
