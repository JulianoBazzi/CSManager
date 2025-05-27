import { MdKeyboardArrowLeft } from 'react-icons/md';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type PreviousPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function PreviousPageGhostIconButton({ ...rest }: PreviousPageGhostIconButtonProps) {
  return (
    <GhostGrayIconButton icon={<Icon as={MdKeyboardArrowLeft} fontSize="2xl" />} aria-label="Previus Page" {...rest} />
  );
}
