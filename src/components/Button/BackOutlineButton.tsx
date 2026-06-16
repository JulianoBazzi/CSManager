import type { ButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';

import { OutlineGrayButton } from '~/components/Button/Base/OutlineGrayButton';

export const BackOutlineButton = ({ ref, ...rest }: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => (
  <OutlineGrayButton ref={ref} w={['100%', 200]} {...rest}>
    Voltar
  </OutlineGrayButton>
);
