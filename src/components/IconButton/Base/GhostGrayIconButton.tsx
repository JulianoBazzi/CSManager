import { forwardRef, type ForwardRefRenderFunction } from 'react';

import { IconButton, type IconButtonProps } from '@chakra-ui/react';

const GhostGrayIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (
  { ...rest }: IconButtonProps,
  ref,
) => <IconButton ref={ref} colorScheme="gray" variant="ghost" {...rest} />;

export const GhostGrayIconButton = forwardRef(GhostGrayIconButtonBase);
