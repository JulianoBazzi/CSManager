import type { ButtonProps } from '@chakra-ui/react';

import { SolidBlueButton } from '~/components/Button/Base/SolidBlueButton';

export function SaveSolidButton({ ...rest }: ButtonProps) {
  return (
    <SolidBlueButton minW={160} {...rest}>
      Salvar
    </SolidBlueButton>
  );
}
