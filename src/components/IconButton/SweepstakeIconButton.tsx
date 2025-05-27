import { forwardRef, type ForwardRefRenderFunction } from 'react';
import { MdOutlineSafetyDivider } from 'react-icons/md';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type SweepstakeIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const SweepstakeIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, SweepstakeIconButtonProps> = (
  { ...rest }: SweepstakeIconButtonProps,
  ref,
) => (
  <GhostGrayIconButton
    ref={ref}
    colorScheme="green"
    variant="solid"
    icon={<Icon as={MdOutlineSafetyDivider} fontSize="2xl" />}
    aria-label="Sortear"
    {...rest}
  />
);

export const SweepstakeIconButton = forwardRef(SweepstakeIconButtonBase);
