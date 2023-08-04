import { forwardRef, ForwardRefRenderFunction } from 'react';
import { RiAddLine } from 'react-icons/ri';

import { IconButtonProps, Icon } from '@chakra-ui/react';

import { GhostGrayIconButton } from '~/components/IconButton/Base/GhostGrayIconButton';

type AddIconButtonProps = Omit<IconButtonProps, 'aria-label'>;

const AddIconButtonBase: ForwardRefRenderFunction<HTMLButtonElement, AddIconButtonProps> = (
  { ...rest }: AddIconButtonProps,
  ref,
) => (
  <GhostGrayIconButton
    ref={ref}
    colorScheme="green"
    variant="solid"
    icon={<Icon as={RiAddLine} fontSize="2xl" />}
    aria-label="Adicionar"
    {...rest}
  />
);

export const AddIconButton = forwardRef(AddIconButtonBase);
