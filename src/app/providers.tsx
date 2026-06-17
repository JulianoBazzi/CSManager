'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import * as Yup from 'yup';
import { ptShort } from 'yup-locale-pt';

import { Toaster } from '~/components/Toaster';
import { AuthProvider } from '~/contexts/AuthContext';
import { FeedbackProvider } from '~/contexts/FeedbackContext';
import { queryClient } from '~/services/queryClient';
import { system } from '~/styles/theme';

Yup.setLocale(ptShort);
Yup.setLocale({ mixed: { notType: 'Valor inválido.' } });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <FeedbackProvider>
            <AuthProvider>{children}</AuthProvider>
          </FeedbackProvider>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
