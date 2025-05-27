import { forwardRef, type ForwardRefRenderFunction } from 'react';
import { RiNumbersLine } from 'react-icons/ri';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type RankingIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const RankingIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, RankingIconButtonProps> = (
  { ...rest }: RankingIconButtonProps,
  ref,
) => (
  <SolidGrayIconButton
    ref={ref}
    icon={<Icon as={RiNumbersLine} fontSize="xl" />}
    aria-label="Ranking"
    title="Ver Ranking"
    {...rest}
  />
);

export const RankingIconButton = forwardRef(RankingIconButtonBase);
