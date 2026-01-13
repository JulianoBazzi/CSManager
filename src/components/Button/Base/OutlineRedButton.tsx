import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef } from 'react';

const OutlineRedButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => <ChakraButton ref={ref} colorScheme="red" variant="outline" w={['100%', 'inherit']} gap="2" {...rest} />;

export const OutlineRedButton = forwardRef(OutlineRedButtonBase);
