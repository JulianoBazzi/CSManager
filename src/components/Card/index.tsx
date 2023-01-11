import { ReactNode } from 'react';

import { Card as ChakraCard, CardProps as ChakraCardProps } from '@chakra-ui/react';

interface ICardProps extends ChakraCardProps {
  children: ReactNode;
}

export default function Card({ children, ...rest }: ICardProps) {
  return (
    <ChakraCard w="100%" {...rest}>
      {children}
    </ChakraCard>
  );
}
