import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
  Field,
  InputGroup,
  Skeleton,
  Spinner,
} from '@chakra-ui/react';
import { allowNumericKeyDown } from '@julianobazzi/nextjs-utils';
import type { ReactNode, Ref } from 'react';
import type { FieldError } from 'react-hook-form';

interface INumberInputProps extends ChakraInputProps {
  name?: string;
  label?: string;
  error?: FieldError;
  required?: boolean;
  loading?: boolean;
  isSearching?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export const NumberInput = ({
  name,
  label,
  error,
  required,
  loading,
  isSearching,
  children,
  maxW,
  ref,
  ...rest
}: INumberInputProps) => (
  <Field.Root invalid={!!error} required={required} maxW={maxW}>
    {!!label && (
      <Field.Label htmlFor={name}>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
    )}
    {loading && <Skeleton height="10" borderRadius={4} />}
    {!loading && (
      <InputGroup endElement={isSearching ? <Spinner size="sm" /> : children}>
        <ChakraInput
          ref={ref}
          id={name}
          type="number"
          name={name}
          autoComplete="off"
          onKeyDown={allowNumericKeyDown}
          onFocus={event => {
            event.target.select();
          }}
          {...rest}
        />
      </InputGroup>
    )}
    {!!error && <Field.ErrorText>{error.message}</Field.ErrorText>}
  </Field.Root>
);
