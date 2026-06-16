import {
  Button,
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
  Field,
  Icon,
  InputGroup,
  Skeleton,
} from '@chakra-ui/react';
import { type Ref, useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

interface IPasswordInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  required?: boolean;
  loading?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export const PasswordInput = ({ name, label, error, required, loading, maxW, ref, ...rest }: IPasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <Field.Root invalid={!!error} required={required} maxW={maxW}>
      {!!label && <Field.Label htmlFor={name}>{label}</Field.Label>}
      {loading && <Skeleton height="10" borderRadius={4} />}
      {!loading && (
        <InputGroup
          endElement={
            <Button variant="plain" h="auto" minW="auto" p="0" onClick={() => setShow(!show)}>
              <Icon fontSize="1.3rem" color="gray.200">
                {show ? <RiEyeOffLine /> : <RiEyeLine />}
              </Icon>
            </Button>
          }
        >
          <ChakraInput type={show ? 'text' : 'password'} ref={ref} id={name} name={name} autoComplete="off" {...rest} />
        </InputGroup>
      )}
      {!!error && <Field.ErrorText>{error.message}</Field.ErrorText>}
    </Field.Root>
  );
};
