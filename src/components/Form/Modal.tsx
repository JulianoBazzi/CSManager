import { CloseButton, Dialog, type DialogRootProps, Portal, Text } from '@chakra-ui/react';
import { type ReactNode, type Ref, useCallback, useImperativeHandle, useState } from 'react';

export interface IModalProps extends Omit<DialogRootProps, 'open' | 'onOpenChange' | 'children'> {
  title: string;
  subtitle?: string;
  onSubmit?: () => void;
  children: ReactNode;
  disableCloseButton?: boolean;
  ref?: Ref<ModalHandle>;
}

export type ModalHandle = {
  onOpenModal: () => void;
  onCloseModal: () => void;
};

// Aliases para manter a API dos modais (ModalBody/ModalFooter) sobre o Dialog do v3.
export const ModalBody = Dialog.Body;
export const ModalFooter = Dialog.Footer;

export const Modal = ({ title, children, disableCloseButton, onSubmit, ref, ...rest }: IModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenModal = useCallback(() => setIsOpen(true), []);

  const onCloseModal = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
      onCloseModal,
    }),
    [onOpenModal, onCloseModal]
  );

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={event => setIsOpen(event.open)}
      closeOnEscape={!disableCloseButton}
      closeOnInteractOutside={false}
      {...rest}
    >
      <Portal>
        <Dialog.Backdrop background="blackAlpha.500" />
        <Dialog.Positioner>
          <Dialog.Content as="form" bg="gray.900" onSubmit={onSubmit}>
            <Dialog.Header>
              <Text as="h5">{title}</Text>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" disabled={disableCloseButton} />
            </Dialog.CloseTrigger>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
