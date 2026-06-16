import { Icon, type IconButtonProps } from '@chakra-ui/react';
import { MdFirstPage } from 'react-icons/md';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type FirstPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function FirstPageGhostIconButton({ ...rest }: FirstPageGhostIconButtonProps) {
  return (
    <GhostGrayIconButton aria-label="First Page" {...rest}>
      <Icon fontSize="2xl">
        <MdFirstPage />
      </Icon>
    </GhostGrayIconButton>
  );
}
