import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { RiRepeatFill } from 'react-icons/ri';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type RefreshIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const RefreshIconButton = ({ ref, ...rest }: RefreshIconButtonProps) => (
  <SolidGrayIconButton ref={ref} aria-label="Atualizar" title="Atualizar" {...rest}>
    <Icon fontSize="xl">
      <RiRepeatFill />
    </Icon>
  </SolidGrayIconButton>
);
