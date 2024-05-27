import { forwardRef, ForwardRefRenderFunction } from 'react';
import { RiRepeatFill } from 'react-icons/ri';

import { IconButtonProps, Icon } from '@chakra-ui/react';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type RefreshIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const RefreshIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, RefreshIconButtonProps> = (
  { ...rest }: RefreshIconButtonProps,
  ref,
) => (
  <SolidGrayIconButton
    ref={ref}
    icon={<Icon as={RiRepeatFill} fontSize="xl" />}
    aria-label="Atualizar"
    title="Atualizar"
    {...rest}
  />
);

export const RefreshIconButton = forwardRef(RefreshIconButtonBase);
