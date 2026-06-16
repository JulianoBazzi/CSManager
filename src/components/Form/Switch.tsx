import { Switch as ChakraSwitch, Field, Skeleton } from '@chakra-ui/react';
import type { ReactNode, Ref } from 'react';
import type { FieldError } from 'react-hook-form';

interface ISwitchProps {
  name: string;
  label?: string;
  error?: FieldError;
  required?: boolean;
  loading?: boolean;
  checked?: boolean;
  disabled?: boolean;
  maxW?: string | string[];
  children?: ReactNode;
  ref?: Ref<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Switch = ({
  name,
  label,
  error,
  required,
  loading,
  checked,
  disabled,
  maxW,
  children,
  ref,
  ...rest
}: ISwitchProps) => (
  <Field.Root invalid={!!error} required={required} maxW={maxW}>
    {!!label && (
      <Field.Label htmlFor={name}>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
    )}
    {loading && <Skeleton height="10" borderRadius={4} />}
    {!loading && (
      <ChakraSwitch.Root checked={checked} disabled={disabled} colorPalette="blue">
        <ChakraSwitch.HiddenInput ref={ref} id={name} name={name} {...rest} />
        <ChakraSwitch.Control />
        {children}
      </ChakraSwitch.Root>
    )}
    {!!error && <Field.ErrorText>{error.message}</Field.ErrorText>}
  </Field.Root>
);
