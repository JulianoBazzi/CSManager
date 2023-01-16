import { CheckIcon } from '@chakra-ui/icons';
import { ButtonProps } from '@chakra-ui/react';

import { SolidBlueButton } from '~/components/Button/Base/SolidBlueButton';

export function SaveSolidButton({ ...rest }: ButtonProps) {
  return (
    <SolidBlueButton minW={160} {...rest}>
      <CheckIcon fontSize="sm" />
      Adicionar
    </SolidBlueButton>
  );
}
