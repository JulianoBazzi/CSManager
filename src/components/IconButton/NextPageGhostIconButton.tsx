import { Icon, type IconButtonProps } from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type NextPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function NextPageGhostIconButton({ ...rest }: NextPageGhostIconButtonProps) {
  return (
    <GhostGrayIconButton aria-label="Next Page" {...rest}>
      <Icon fontSize="2xl">
        <MdKeyboardArrowRight />
      </Icon>
    </GhostGrayIconButton>
  );
}
