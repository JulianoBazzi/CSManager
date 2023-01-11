import { ReactNode } from 'react';

import {
  CardHeader as ChakraCardHeader,
  CardHeaderProps as ChakraCardHeaderProps,
  Divider,
  Flex,
  Heading,
} from '@chakra-ui/react';

interface ICardHeaderProps extends ChakraCardHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function CardHeader({ title, children, ...rest }: ICardHeaderProps) {
  return (
    <>
      <ChakraCardHeader w="100%" {...rest}>
        <Flex justifyContent="space-between">
          <Heading size="lg">{title}</Heading>
          {children}
        </Flex>
      </ChakraCardHeader>
      <Divider mt="-2" />
    </>
  );
}
