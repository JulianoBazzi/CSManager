import { forwardRef, type ForwardRefRenderFunction } from 'react';
import { RiTeamFill } from 'react-icons/ri';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type RaffleIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const RaffleIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, RaffleIconButtonProps> = (
  { ...rest }: RaffleIconButtonProps,
  ref,
) => (
  <GhostGrayIconButton
    ref={ref}
    colorScheme="green"
    variant="solid"
    icon={<Icon as={RiTeamFill} fontSize="2xl" />}
    aria-label="Sortear Times"
    {...rest}
  />
);

export const RaffleIconButton = forwardRef(RaffleIconButtonBase);
