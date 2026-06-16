import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { RiDeleteBin2Line } from 'react-icons/ri';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type DeleteSolidIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const DeleteSolidIconButton = ({ ref, ...rest }: DeleteSolidIconButtonProps) => (
  <SolidGrayIconButton ref={ref} aria-label="Remover" title="Excluir" {...rest}>
    <Icon fontSize="xl">
      <RiDeleteBin2Line />
    </Icon>
  </SolidGrayIconButton>
);
