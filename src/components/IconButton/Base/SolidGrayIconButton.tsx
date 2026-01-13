import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef } from 'react';

const SolidGrayIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (
  { ...rest }: IconButtonProps,
  ref
) => <IconButton ref={ref} colorScheme="gray" {...rest} />;

export const SolidGrayIconButton = forwardRef(SolidGrayIconButtonBase);
