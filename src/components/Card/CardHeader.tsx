import { ReactNode } from 'react';

import {
  CardHeader as ChakraCardHeader,
  CardHeaderProps as ChakraCardHeaderProps,
  Divider,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react';

interface ICardHeaderProps extends ChakraCardHeaderProps {
  title: string;
  isFetching?: boolean;
  children?: ReactNode;
}

export default function CardHeader({ title, isFetching, children, ...rest }: ICardHeaderProps) {
  return (
    <>
      <ChakraCardHeader w="100%" {...rest}>
        <Flex justifyContent="space-between">
          <Flex align="center" gap="2">
            <Heading size="lg">{title}</Heading>
            {isFetching && <Spinner color="blue.200" />}
          </Flex>
          {children}
        </Flex>
      </ChakraCardHeader>
      <Divider mt="-2" />
    </>
  );
}
