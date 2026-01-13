import type { ButtonProps } from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef } from 'react';

import { SolidBlueButton } from '~/components/Button/Base/SolidBlueButton';

const ConfirmSolidButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { ...rest }: ButtonProps,
  ref
) => (
  <SolidBlueButton ref={ref} w={['100%', 200]} {...rest}>
    Confirmar
  </SolidBlueButton>
);

export const ConfirmSolidButton = forwardRef(ConfirmSolidButtonBase);
