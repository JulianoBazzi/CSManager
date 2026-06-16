import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import type { Ref } from 'react';

export const OutlineGrayButton = ({ ref, ...rest }: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => (
  <ChakraButton ref={ref} colorPalette="gray" variant="outline" w={['100%', 'inherit']} gap="1" {...rest} />
);
