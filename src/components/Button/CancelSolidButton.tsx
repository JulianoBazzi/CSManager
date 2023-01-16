import { ButtonProps } from '@chakra-ui/react';

import { SolidRedButton } from '~/components/Button/Base/SolidRedButton';

export function CancelSolidButton({ ...rest }: ButtonProps) {
  return (
    <SolidRedButton minW={160} {...rest}>
      Cancelar
    </SolidRedButton>
  );
}
