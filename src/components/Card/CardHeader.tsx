import type { ElementType, ReactNode } from 'react';

import {
  CardHeader as ChakraCardHeader,
  type CardHeaderProps as ChakraCardHeaderProps,
  Divider,
  Flex,
  Heading,
  Icon,
  Spinner,
} from '@chakra-ui/react';

interface ICardHeaderProps extends ChakraCardHeaderProps {
  icon?: ElementType;
  size?: 'sm' | 'md' | 'lg';
  title: string;
  isFetching?: boolean;
  children?: ReactNode;
}

export default function CardHeader({
  icon, size = 'lg', title, isFetching, children, ...rest
}: ICardHeaderProps) {
  return (
    <>
      <ChakraCardHeader w="100%" {...rest}>
        <Flex justifyContent="space-between">
          <Flex align="center" gap="2">
            {icon && <Icon as={icon} fontSize={size === 'lg' ? '2xl' : 'xl'} />}
            <Heading size={size}>{title}</Heading>
            {isFetching && <Spinner color="blue.200" />}
          </Flex>
          {children}
        </Flex>
      </ChakraCardHeader>
      <Divider mt="-2" />
    </>
  );
}
