import { MdKeyboardArrowRight } from 'react-icons/md';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type NextPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function NextPageGhostIconButton({ ...rest }: NextPageGhostIconButtonProps) {
  return (
    <GhostGrayIconButton icon={<Icon as={MdKeyboardArrowRight} fontSize="2xl" />} aria-label="Next Page" {...rest} />
  );
}
