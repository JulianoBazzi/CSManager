import { forwardRef, ForwardRefRenderFunction } from 'react';

import { IconButton, IconButtonProps } from '@chakra-ui/react';

const SolidGrayIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (
  { ...rest }: IconButtonProps,
  ref,
) => <IconButton ref={ref} colorScheme="gray" {...rest} />;

export const SolidGrayIconButton = forwardRef(SolidGrayIconButtonBase);
