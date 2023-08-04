import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputProps as ChakraInputProps,
  InputRightElement,
  Skeleton,
  Spinner,
} from '@chakra-ui/react';

interface INumberInputProps extends ChakraInputProps {
  name?: string;
  label?: string;
  error?: FieldError;
  isRequired?: boolean;
  isLoading?: boolean;
  isSearching?: boolean;
  children?: ReactNode;
}

const NumberInputBase: ForwardRefRenderFunction<HTMLInputElement, INumberInputProps> = (
  {
    name, label, error, isRequired, isLoading, isSearching, children, maxW, ...rest
  }: INumberInputProps,
  ref,
) => (
  <FormControl isInvalid={!!error} isRequired={isRequired} maxW={maxW}>
    {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    {isLoading && <Skeleton height="10" borderRadius={4} />}
    {!isLoading && (
    <InputGroup>
      <ChakraInput
        ref={ref}
        id={name}
        type="number"
        name={name}
        autoComplete="off"
        onKeyPress={(event) => {
          const reg = /^[0-9]*$/;
          if (!reg.test(event.key)) {
            event.preventDefault();
          }
        }}
        onFocus={(event) => {
          event.target.select();
        }}
        {...rest}
      />
      {isSearching && (
      <InputRightElement>
        <Spinner ml="2" color="orange.500" size="sm" />
      </InputRightElement>
      )}
      {children}
    </InputGroup>
    )}
    {!!error && <FormErrorMessage my="1">{error.message}</FormErrorMessage>}
  </FormControl>
);

export const NumberInput = forwardRef(NumberInputBase);
