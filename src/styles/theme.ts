import { ChakraTheme, extendTheme } from '@chakra-ui/react';
import { Roboto } from 'next/font/google';

const nextFont = Roboto({
  weight: ['400', '500', '700'],
  display: 'swap',
  subsets: ['latin'],
});

const customTheme: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    gray: {},
  },
  fonts: {
    heading: nextFont.style.fontFamily,
    body: nextFont.style.fontFamily,
  },
  styles: {
    global: {
      body: {},
    },
  },
};

export const theme = extendTheme(customTheme);
