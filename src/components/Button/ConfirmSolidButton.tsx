import type { ButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';

import { SolidBlueButton } from '~/components/Button/Base/SolidBlueButton';

export const ConfirmSolidButton = ({ ref, ...rest }: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => (
  <SolidBlueButton ref={ref} w={['100%', 200]} {...rest}>
    Confirmar
  </SolidBlueButton>
);
