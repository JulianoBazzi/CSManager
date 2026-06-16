import { Icon, type IconButtonProps } from '@chakra-ui/react';
import { MdLastPage } from 'react-icons/md';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type LastPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function LastPageGhostIconButton({ ...rest }: LastPageGhostIconButtonProps) {
  return (
    <GhostGrayIconButton aria-label="Last Page" {...rest}>
      <Icon fontSize="2xl">
        <MdLastPage />
      </Icon>
    </GhostGrayIconButton>
  );
}
