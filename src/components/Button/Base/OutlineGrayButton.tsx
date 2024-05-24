import { forwardRef, ForwardRefRenderFunction } from 'react';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

const OutlineGrayButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    ...rest
  }: ButtonProps,
  ref,
) => (
  <ChakraButton
    ref={ref}
    colorScheme="gray"
    variant="outline"
    w={['100%', 'inherit']}
    gap="1"
    {...rest}
  />
);

export const OutlineGrayButton = forwardRef(OutlineGrayButtonBase);
