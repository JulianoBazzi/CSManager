import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  type ForwardRefRenderFunction,
  forwardRef,
  type ReactNode,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

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
}

const AlertBase: ForwardRefRenderFunction<AlertHandle, IAlertProps> = (
  { title, message, children, cancelRef, onClose, ...rest }: IAlertProps,
  ref
) => {
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
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onCloseAlert} size="sm" isCentered {...rest}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader as="h6">{title}</AlertDialogHeader>
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter justifyContent="space-between" flexDir={{ base: 'column', md: 'row' }} gap="4">
            {children}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export const Alert = forwardRef(AlertBase);
