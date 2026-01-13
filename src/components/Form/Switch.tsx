import {
  Switch as ChakraSwitch,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Skeleton,
  type SwitchProps,
} from '@chakra-ui/react';
import { type ForwardRefRenderFunction, forwardRef, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface ISwitchProps extends SwitchProps {
  name: string;
  label?: string;
  error?: FieldError;
  isRequired?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}

const SwitchBase: ForwardRefRenderFunction<HTMLInputElement, ISwitchProps> = (
  { name, label, error, isRequired, isLoading, maxW, children, ...rest }: ISwitchProps,
  ref
) => (
  <FormControl isInvalid={!!error} isRequired={isRequired} maxW={maxW}>
    {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    {isLoading && <Skeleton height="10" borderRadius={4} />}
    {!isLoading && (
      <InputGroup>
        <ChakraSwitch ref={ref} id={name} name={name} autoComplete="off" colorScheme="whiteAlpha" {...rest} />
        {children}
      </InputGroup>
    )}
    {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
);

export const Switch = forwardRef(SwitchBase);
