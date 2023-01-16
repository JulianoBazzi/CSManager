import { forwardRef, ForwardRefRenderFunction, ReactNode, useCallback, useImperativeHandle, useState } from 'react';

import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';

export interface IModalProps extends Omit<ChakraModalProps, 'onClose' | 'isOpen'> {
  title: string;
  subtitle?: string;
  onSubmit?: () => void;
  children: ReactNode;
  disableCloseButton?: boolean;
}

export type ModalHandle = {
  onOpenModal: () => void;
  onCloseModal: () => void;
};

const ModalBase: ForwardRefRenderFunction<ModalHandle, IModalProps> = (
  { title, children, disableCloseButton, onSubmit, ...rest }: IModalProps,
  ref
) => {
  const [isOpen, setIsOpen] = useState(false);

  function onOpenModal() {
    setIsOpen(true);
  }

  const onCloseModal = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
      onCloseModal,
    }),
    [onCloseModal]
  );

  return (
    <ChakraModal onClose={onCloseModal} isOpen={isOpen} closeOnEsc closeOnOverlayClick={false} {...rest}>
      <ModalOverlay background="blackAlpha.500" />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>
          <Text as="h5">{title}</Text>
        </ModalHeader>
        {!disableCloseButton && <ModalCloseButton />}
        {children}
      </ModalContent>
    </ChakraModal>
  );
};

export const Modal = forwardRef(ModalBase);
