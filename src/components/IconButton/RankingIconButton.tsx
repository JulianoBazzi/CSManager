import { Icon, type IconButtonProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import { RiNumbersLine } from 'react-icons/ri';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type RankingIconButtonProps = Omit<IconButtonProps, 'aria-label'> & { ref?: Ref<HTMLButtonElement> };

export const RankingIconButton = ({ ref, ...rest }: RankingIconButtonProps) => (
  <SolidGrayIconButton ref={ref} aria-label="Ranking" title="Ver Ranking" {...rest}>
    <Icon fontSize="xl">
      <RiNumbersLine />
    </Icon>
  </SolidGrayIconButton>
);
