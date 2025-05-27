import { forwardRef, useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  type InputProps as ChakraInputProps,
  InputRightElement,
  Skeleton,
  Icon,
} from '@chakra-ui/react';

interface IPasswordInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  isRequired?: boolean;
  isLoading?: boolean;
}

function PasswordInputBase(
  {
    name, label, error, isRequired, isLoading, maxW, ...rest
  }: IPasswordInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const [show, setShow] = useState(false);

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} maxW={maxW}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {isLoading && <Skeleton height="10" borderRadius={4} />}
      {!isLoading && (
        <InputGroup size="md">
          <ChakraInput type={show ? 'text' : 'password'} ref={ref} id={name} name={name} autoComplete="off" {...rest} />
          <InputRightElement mx="1">
            <Button variant="unstyled" onClick={() => setShow(!show)}>
              <Icon as={show ? RiEyeOffLine : RiEyeLine} fontSize="1.3rem" mt="1" color="gray.200" />
            </Button>
          </InputRightElement>
        </InputGroup>
      )}
      {!!error && <FormErrorMessage my="1">{error.message}</FormErrorMessage>}
    </FormControl>
  );
}

export const PasswordInput = forwardRef(PasswordInputBase);
