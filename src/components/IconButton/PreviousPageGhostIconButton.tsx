import { Icon, type IconButtonProps } from '@chakra-ui/react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type PreviousPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function PreviousPageGhostIconButton({ ...rest }: PreviousPageGhostIconButtonProps) {
  return (
    <GhostGrayIconButton aria-label="Previus Page" {...rest}>
      <Icon fontSize="2xl">
        <MdKeyboardArrowLeft />
      </Icon>
    </GhostGrayIconButton>
  );
}
