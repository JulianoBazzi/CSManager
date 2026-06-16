import {
  Card as ChakraCard,
  type CardHeaderProps as ChakraCardHeaderProps,
  Flex,
  Heading,
  Icon,
  Separator,
  Spinner,
} from '@chakra-ui/react';
import { createElement, type ElementType, type ReactNode } from 'react';

interface ICardHeaderProps extends ChakraCardHeaderProps {
  icon?: ElementType;
  size?: 'sm' | 'md' | 'lg';
  title: string;
  isFetching?: boolean;
  children?: ReactNode;
}

export default function CardHeader({ icon, size = 'lg', title, isFetching, children, ...rest }: ICardHeaderProps) {
  return (
    <>
      <ChakraCard.Header w="100%" {...rest}>
        <Flex justifyContent="space-between">
          <Flex align="center" gap="2">
            {icon && <Icon fontSize={size === 'lg' ? '2xl' : 'xl'}>{createElement(icon)}</Icon>}
            <Heading size={size}>{title}</Heading>
            {isFetching && <Spinner color="blue.200" />}
          </Flex>
          {children}
        </Flex>
      </ChakraCard.Header>
      <Separator mt="-2" />
    </>
  );
}
