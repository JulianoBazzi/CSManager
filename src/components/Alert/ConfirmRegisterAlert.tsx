/** biome-ignore-all lint/suspicious/noExplicitAny: <ignore> */
import { type ForwardRefRenderFunction, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { alertOrigins } from '~/assets/alertOrigins';
import { Alert, type AlertHandle, type AlertOriginEnum, AlertTypeEnum } from '~/components/Alert';
import { BackOutlineButton } from '~/components/Button/BackOutlineButton';
import { ConfirmSolidButton } from '~/components/Button/ConfirmSolidButton';

interface IOpenConfirmRegisterAlertProps<T> {
  type: AlertTypeEnum;
  origin: AlertOriginEnum;
  data: T;
  message?: string;
  onConfirm: (data: T) => Promise<T> | Promise<void> | void;
}

export type ConfirmRegisterAlertHandle = {
  onOpenAlert: (data: IOpenConfirmRegisterAlertProps<any>) => void;
  onCloseAlert: () => void;
};

interface IConfirmRegisterAlertProps {
  isSubmitting?: boolean;
  onClose?: () => void;
}

const ConfirmRegisterAlertBase: ForwardRefRenderFunction<ConfirmRegisterAlertHandle, IConfirmRegisterAlertProps> = (
  { isSubmitting, onClose, ...rest }: IConfirmRegisterAlertProps,
  ref
) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const alertRef = useRef<AlertHandle>(null);

  const [alertProps, setAlertProps] = useState<IOpenConfirmRegisterAlertProps<any> | undefined>(undefined);

  const description = () => alertOrigins.find(origin => origin.id === alertProps?.origin)?.name ?? 'Não Localizado';

  const title = () => {
    if (alertProps?.type === AlertTypeEnum.Update) {
      return `Alterar ${description()}`;
    }
    if (alertProps?.type === AlertTypeEnum.Delete) {
      return `Remover ${description()}`;
    }

    return `Cadastrar ${description()}`;
  };

  const message = () => {
    if (alertProps?.type === AlertTypeEnum.Update) {
      return `alterar esta ${description()}`;
    }
    if (alertProps?.type === AlertTypeEnum.Delete) {
      return `remover este ${description()}`;
    }

    return `cadastrar esta ${description()}`;
  };

  const onOpenAlert = useCallback((props: IOpenConfirmRegisterAlertProps<any>) => {
    setAlertProps(props);
    alertRef.current?.onOpenAlert();
  }, []);

  const onCloseAlert = useCallback(() => {
    alertRef.current?.onCloseAlert();
  }, []);

  function onConfirmAlert() {
    if (alertProps?.onConfirm) {
      alertProps?.onConfirm(alertProps?.data);
    }
    onCloseAlert();
  }

  useImperativeHandle(
    ref,
    () => ({
      onOpenAlert,
      onCloseAlert,
    }),
    [onOpenAlert, onCloseAlert]
  );

  return (
    <Alert
      ref={alertRef}
      cancelRef={cancelRef}
      onClose={onClose}
      title={title()}
      message={
        alertProps?.message ? alertProps?.message : `Você tem certeza que gostaria de ${message().toLocaleLowerCase()}?`
      }
      {...rest}
    >
      <ConfirmSolidButton onClick={() => onConfirmAlert()} isLoading={isSubmitting} />
      <BackOutlineButton ref={cancelRef} onClick={() => onCloseAlert()} isDisabled={isSubmitting} autoFocus />
    </Alert>
  );
};

export const ConfirmRegisterAlert = forwardRef(ConfirmRegisterAlertBase);
