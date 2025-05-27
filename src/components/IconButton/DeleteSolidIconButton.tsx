import { forwardRef, type ForwardRefRenderFunction } from 'react';
import { RiDeleteBin2Line } from 'react-icons/ri';

import { type IconButtonProps, Icon } from '@chakra-ui/react';

import { SolidGrayIconButton } from '~/components/IconButton/Base/SolidGrayIconButton';

type DeleteSolidIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const DeleteSolidIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, DeleteSolidIconButtonProps> = (
  { ...rest }: DeleteSolidIconButtonProps,
  ref,
) => (
  <SolidGrayIconButton
    ref={ref}
    icon={<Icon as={RiDeleteBin2Line} fontSize="xl" />}
    aria-label="Remover"
    title="Excluir"
    {...rest}
  />
);

export const DeleteSolidIconButton = forwardRef(DeleteSolidIconButtonBase);
