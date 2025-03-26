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
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#111111',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#991919',
      800: '#511111',
      900: '#300c0c',
      950: '#1f0808',
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#a41752',
      800: '#6d0e34',
      900: '#45061f',
      950: '#2c0514',
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#641ba3',
      800: '#4a1772',
      900: '#2f0553',
      950: '#1a032e',
    },
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0c5c72',
      800: '#134152',
      900: '#072a38',
      950: '#051b24',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#a3cfff',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#173da6',
      800: '#1a3478',
      900: '#14204a',
      950: '#0c142e',
    },
    teal: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0c5d56',
      800: '#114240',
      900: '#032726',
      950: '#021716',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#116932',
      800: '#124a28',
      900: '#042713',
      950: '#03190c',
    },
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#845209',
      800: '#713f12',
      900: '#422006',
      950: '#281304',
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#92310a',
      800: '#6c2710',
      900: '#3b1106',
      950: '#220a04',
    },
  },
  fonts: {
    heading: nextFont.style.fontFamily,
    body: nextFont.style.fontFamily,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.950' : 'white',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'black',
      },
    }),
  },
};

export const theme = extendTheme(customTheme);
