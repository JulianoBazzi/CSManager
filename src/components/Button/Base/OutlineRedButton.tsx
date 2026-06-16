import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import type { Ref } from 'react';

export const OutlineRedButton = ({ ref, ...rest }: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => (
  <ChakraButton ref={ref} colorPalette="red" variant="outline" w={['100%', 'inherit']} gap="2" {...rest} />
);
