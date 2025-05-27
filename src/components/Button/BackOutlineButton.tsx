import { forwardRef, type ForwardRefRenderFunction } from 'react';

import type { ButtonProps } from '@chakra-ui/react';

import { OutlineGrayButton } from '~/components/Button/Base/OutlineGrayButton';

const BackOutlineButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    ...rest
  }: ButtonProps,
  ref,
) => (
  <OutlineGrayButton
    ref={ref}
    w={['100%', 200]}
    {...rest}
  >
    Voltar
  </OutlineGrayButton>
);

export const BackOutlineButton = forwardRef(BackOutlineButtonBase);
