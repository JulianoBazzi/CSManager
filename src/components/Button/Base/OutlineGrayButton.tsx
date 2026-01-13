import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef } from 'react';

const OutlineGrayButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => <ChakraButton ref={ref} colorScheme="gray" variant="outline" w={['100%', 'inherit']} gap="1" {...rest} />;

export const OutlineGrayButton = forwardRef(OutlineGrayButtonBase);
