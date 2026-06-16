import { type CardRootProps, Card as ChakraCard } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ICardProps extends CardRootProps {
  children: ReactNode;
}

export default function Card({ children, ...rest }: ICardProps) {
  return (
    <ChakraCard.Root bg="gray.900" w="100%" {...rest}>
      {children}
    </ChakraCard.Root>
  );
}
