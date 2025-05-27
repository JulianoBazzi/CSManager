import {
  type ForwardRefRenderFunction,
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import {
  Modal as ChakraModal,
  type ModalProps as ChakraModalProps,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
    <ChakraModal onClose={onCloseModal} isOpen={isOpen} closeOnEsc closeOnOverlayClick={false} {...rest}>
      <ModalOverlay background="blackAlpha.500" />
      <ModalContent as="form" bg="gray.900" onSubmit={onSubmit}>
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
