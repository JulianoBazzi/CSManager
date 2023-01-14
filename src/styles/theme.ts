import { ChakraTheme, extendTheme } from '@chakra-ui/react';

const customTheme: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    gray: {},
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      body: {},
    },
  },
};

export const theme = extendTheme(customTheme);
