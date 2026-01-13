import { CardBody as ChakraCardBody, type CardBodyProps as ChakraCardBodyProps, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ICardBodyProps extends ChakraCardBodyProps {
  children: ReactNode;
}

export default function CardBody({ children, ...rest }: ICardBodyProps) {
  return (
    <ChakraCardBody w="100%" {...rest}>
      <Stack>{children}</Stack>
    </ChakraCardBody>
  );
}
