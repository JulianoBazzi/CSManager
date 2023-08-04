import { ButtonProps } from '@chakra-ui/react';

import { OutlineRedButton } from '~/components/Button/Base/OutlineRedButton';

export function CancelOutlineButton({ ...rest }: ButtonProps) {
  return (
    <OutlineRedButton minW={160} {...rest}>
      Cancelar
    </OutlineRedButton>
  );
}
