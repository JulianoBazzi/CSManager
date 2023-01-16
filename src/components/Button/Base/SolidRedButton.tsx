import { forwardRef, ForwardRefRenderFunction } from 'react';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

const SolidRedButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => <ChakraButton ref={ref} colorScheme="red" variant="solid" w={['100%', 'inherit']} gap="2" {...rest} />;

export const SolidRedButton = forwardRef(SolidRedButtonBase);
