import { Switch as ChakraSwitch, Skeleton, type SwitchRootProps } from '@chakra-ui/react';
import type { Ref } from 'react';
import type { FieldError } from 'react-hook-form';

interface ISwitchProps extends SwitchRootProps {
  name: string;
  label?: string;
  error?: FieldError;
  loading?: boolean;
  ref?: Ref<HTMLLabelElement>;
}

export const Switch = ({ name, label, error, disabled, loading, ref, ...rest }: ISwitchProps) => {
  if (loading) {
    return <Skeleton w="12" h="6" borderRadius="full" />;
  }

  return (
    <ChakraSwitch.Root ref={ref} name={name} invalid={!!error} disabled={disabled} colorPalette="blue" {...rest}>
      <ChakraSwitch.HiddenInput />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb>
          <ChakraSwitch.ThumbIndicator />
        </ChakraSwitch.Thumb>
      </ChakraSwitch.Control>
      {!!label && <ChakraSwitch.Label>{label}</ChakraSwitch.Label>}
    </ChakraSwitch.Root>
  );
};
