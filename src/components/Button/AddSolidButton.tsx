import { AddIcon } from '@chakra-ui/icons';
import { ButtonProps } from '@chakra-ui/react';

import { SolidGreenButton } from '~/components/Button/Base/SolidGreenButton';

export function AddSolidButton({ ...rest }: ButtonProps) {
  return (
    <SolidGreenButton minW={160} {...rest}>
      <AddIcon fontSize="sm" />
      Adicionar
    </SolidGreenButton>
  );
}
