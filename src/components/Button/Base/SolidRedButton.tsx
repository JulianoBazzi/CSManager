import { forwardRef, type ForwardRefRenderFunction } from 'react';

import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react';

const SolidRedButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref,
) => <ChakraButton ref={ref} colorScheme="red" variant="solid" w={['100%', 'inherit']} gap="2" {...rest} />;

export const SolidRedButton = forwardRef(SolidRedButtonBase);
