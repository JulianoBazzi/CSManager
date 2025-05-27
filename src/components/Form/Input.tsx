import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  type InputProps as ChakraInputProps,
  Skeleton,
} from '@chakra-ui/react';

interface IInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  isRequired?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  {
    name, label, error, isRequired, isLoading, maxW, children, ...rest
  }: IInputProps,
  ref,
) => (
  <FormControl isInvalid={!!error} isRequired={isRequired} maxW={maxW}>
    {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    {isLoading && <Skeleton height="10" borderRadius={4} />}
    {!isLoading && (
    <InputGroup>
      <ChakraInput ref={ref} id={name} name={name} autoComplete="off" {...rest} />
      {children}
    </InputGroup>
    )}
    {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
);

export const Input = forwardRef(InputBase);
