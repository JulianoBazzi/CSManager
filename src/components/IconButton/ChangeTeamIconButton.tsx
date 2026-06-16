import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { RiArrowLeftRightLine } from 'react-icons/ri';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type ChangeTeamIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const ChangeTeamIconButton = ({ ref, ...rest }: ChangeTeamIconButtonProps) => (
  <SolidGrayIconButton ref={ref} aria-label="Alterar" title="Mudar de Time" {...rest}>
    <Icon fontSize="xl">
      <RiArrowLeftRightLine />
    </Icon>
  </SolidGrayIconButton>
);
