import { forwardRef, ForwardRefRenderFunction } from 'react';
import { RiArrowLeftRightLine } from 'react-icons/ri';

import { IconButtonProps, Icon } from '@chakra-ui/react';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type ChangeTeamIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const ChangeTeamIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ChangeTeamIconButtonProps> = (
  { ...rest }: ChangeTeamIconButtonProps,
  ref,
) => (
  <SolidGrayIconButton
    ref={ref}
    icon={<Icon as={RiArrowLeftRightLine} fontSize="xl" />}
    aria-label="Alterar"
    title="Mudar de Time"
    {...rest}
  />
);

export const ChangeTeamIconButton = forwardRef(ChangeTeamIconButtonBase);
