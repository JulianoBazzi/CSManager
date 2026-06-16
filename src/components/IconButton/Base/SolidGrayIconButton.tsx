import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';

export const SolidGrayIconButton = ({ ref, ...rest }: IconButtonProps & { ref?: Ref<HTMLButtonElement> }) => (
  <IconButton ref={ref} colorPalette="gray" {...rest} />
);
