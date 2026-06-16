import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { RiTeamFill } from 'react-icons/ri';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type RaffleIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const RaffleIconButton = ({ ref, ...rest }: RaffleIconButtonProps) => (
  <GhostGrayIconButton ref={ref} colorPalette="green" variant="solid" aria-label="Sortear Times" {...rest}>
    <Icon fontSize="2xl">
      <RiTeamFill />
    </Icon>
  </GhostGrayIconButton>
);
