import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import type { Ref } from 'react';

export const SolidBlueButton = ({ ref, ...rest }: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => (
  <ChakraButton ref={ref} colorPalette="blue" variant="solid" w={['100%', 'inherit']} gap="2" {...rest} />
);
