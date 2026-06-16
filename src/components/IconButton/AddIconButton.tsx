import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { RiAddLine } from 'react-icons/ri';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type AddIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const AddIconButton = ({ ref, ...rest }: AddIconButtonProps) => (
  <GhostGrayIconButton ref={ref} colorPalette="green" variant="solid" aria-label="Adicionar" {...rest}>
    <Icon fontSize="2xl">
      <RiAddLine />
    </Icon>
  </GhostGrayIconButton>
);
