import { forwardRef, ForwardRefRenderFunction } from 'react';

import { ButtonProps } from '@chakra-ui/react';

import { SolidGreenButton } from '~/components/Button/Base/SolidGreenButton';

const ConfirmSolidButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    ...rest
  }: ButtonProps,
  ref,
) => (
  <SolidGreenButton
    ref={ref}
    w={['100%', 200]}
    {...rest}
  >
    Confirmar
  </SolidGreenButton>
);

export const ConfirmSolidButton = forwardRef(ConfirmSolidButtonBase);
