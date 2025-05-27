import { MdLastPage } from 'react-icons/md';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type LastPageGhostIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

export function LastPageGhostIconButton({ ...rest }: LastPageGhostIconButtonProps) {
  return <GhostGrayIconButton icon={<Icon as={MdLastPage} fontSize="2xl" />} aria-label="Last Page" {...rest} />;
}
