import { forwardRef, ForwardRefRenderFunction } from 'react';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

const SolidGreenButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref,
) => <ChakraButton ref={ref} colorScheme="green" variant="solid" w={['100%', 'inherit']} gap="2" {...rest} />;

export const SolidGreenButton = forwardRef(SolidGreenButtonBase);
