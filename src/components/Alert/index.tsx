import { Dialog, Portal } from '@chakra-ui/react';
import { type ReactNode, type Ref, type RefObject, useCallback, useImperativeHandle, useState } from 'react';

export enum AlertTypeEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export enum AlertOriginEnum {
  Player = 'player',
}

export type AlertHandle = {
  onOpenAlert: () => void;
  onCloseAlert: () => void;
};

interface IAlertProps {
  title: string;
  message: string;
  children: ReactNode;
  cancelRef: RefObject<HTMLButtonElement | null>;
  onClose?: () => void;
  ref?: Ref<AlertHandle>;
}

export const Alert = ({ title, message, children, cancelRef, onClose, ref }: IAlertProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenAlert = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseAlert = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  }, [onClose]);

  useImperativeHandle(
    ref,
    () => ({
      onOpenAlert,
      onCloseAlert,
    }),
    [onOpenAlert, onCloseAlert]
  );

  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onOpenChange={event => (event.open ? setIsOpen(true) : onCloseAlert())}
      size="sm"
      placement="center"
      initialFocusEl={() => cancelRef.current}
    >
      <Portal>
        <Dialog.Backdrop background="blackAlpha.500" />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{message}</Dialog.Body>
            <Dialog.Footer justifyContent="space-between" flexDir={{ base: 'column', md: 'row' }} gap="4">
              {children}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
