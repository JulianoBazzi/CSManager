import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef } from 'react';

const SolidRedButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => <ChakraButton ref={ref} colorScheme="red" variant="solid" w={['100%', 'inherit']} gap="2" {...rest} />;

export const SolidRedButton = forwardRef(SolidRedButtonBase);
