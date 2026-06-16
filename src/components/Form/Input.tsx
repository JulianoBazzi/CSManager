import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
  Field,
  InputGroup,
  Skeleton,
} from '@chakra-ui/react';
import type { ReactNode, Ref } from 'react';
import type { FieldError } from 'react-hook-form';

interface IInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  required?: boolean;
  loading?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ name, label, error, required, loading, maxW, children, ref, ...rest }: IInputProps) => (
  <Field.Root invalid={!!error} required={required} maxW={maxW}>
    {!!label && (
      <Field.Label htmlFor={name}>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
    )}
    {loading && <Skeleton height="10" borderRadius={4} />}
    {!loading && (
      <InputGroup endElement={children}>
        <ChakraInput ref={ref} id={name} name={name} autoComplete="off" {...rest} />
      </InputGroup>
    )}
    {!!error && <Field.ErrorText>{error.message}</Field.ErrorText>}
  </Field.Root>
);
