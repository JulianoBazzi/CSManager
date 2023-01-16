import { ReactNode } from 'react';

import { CardBody as ChakraCardBody, CardBodyProps as ChakraCardBodyProps, Stack } from '@chakra-ui/react';

interface ICardBodyProps extends ChakraCardBodyProps {
  children: ReactNode;
}

export default function CardBody({ children, ...rest }: ICardBodyProps) {
  return (
    <ChakraCardBody w="100%" {...rest}>
      <Stack spacing="4">{children}</Stack>
    </ChakraCardBody>
  );
}
