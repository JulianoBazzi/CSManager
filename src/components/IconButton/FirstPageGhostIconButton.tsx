import { MdFirstPage } from 'react-icons/md';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type FirstPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function FirstPageGhostIconButton({ ...rest }: FirstPageGhostIconButtonProps) {
  return <GhostGrayIconButton icon={<Icon as={MdFirstPage} fontSize="2xl" />} aria-label="First Page" {...rest} />;
}
