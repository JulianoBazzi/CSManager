import { forwardRef, ForwardRefRenderFunction } from 'react';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

const OutlineRedButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => <ChakraButton ref={ref} colorScheme="red" variant="outline" w={['100%', 'inherit']} gap="2" {...rest} />;

export const OutlineRedButton = forwardRef(OutlineRedButtonBase);
