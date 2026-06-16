import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { MdOutlineSafetyDivider } from 'react-icons/md';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type SweepstakeIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const SweepstakeIconButton = ({ ref, ...rest }: SweepstakeIconButtonProps) => (
  <GhostGrayIconButton ref={ref} colorPalette="green" variant="solid" aria-label="Sortear" {...rest}>
    <Icon fontSize="2xl">
      <MdOutlineSafetyDivider />
    </Icon>
  </GhostGrayIconButton>
);
