import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef } from 'react';

const SolidGreenButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => <ChakraButton ref={ref} colorScheme="green" variant="solid" w={['100%', 'inherit']} gap="2" {...rest} />;

export const SolidGreenButton = forwardRef(SolidGreenButtonBase);
