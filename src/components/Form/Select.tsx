/** biome-ignore-all lint/suspicious/noExplicitAny: <ignore> */
import { Field, Skeleton } from '@chakra-ui/react';
import { Select as ChakraReactSelect, type SelectInstance } from 'chakra-react-select';
import type { Ref } from 'react';

import type ISelectOption from '~/models/ISelectOption';

interface ISelectProps {
  name: string;
  label?: string;
  error?: any;
  maxW?: string | string[];
  options: ISelectOption[];
  isSearchable?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isMulti?: boolean;
  required?: boolean;
  loading?: boolean;
  value?: ISelectOption | ISelectOption[];
  onChange: (option: any) => void;
  ref?: Ref<SelectInstance<ISelectOption>>;
}

export const Select = ({
  name,
  label,
  error,
  maxW,
  options,
  isSearchable = false,
  isClearable,
  isMulti,
  disabled,
  required,
  loading,
  value,
  onChange,
  ref,
}: ISelectProps) => {
  const cursorType = () => {
    if (disabled) {
      return 'not-allowed';
    }
    if (isSearchable) {
      return 'text';
    }

    return 'pointer';
  };

  return (
    <Field.Root invalid={!!error} required={required} maxW={maxW}>
      {!!label && (
        <Field.Label htmlFor={name}>
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
      )}
      {loading && <Skeleton height="10" borderRadius={4} />}
      {!loading && (
        <ChakraReactSelect
          ref={ref}
          id={name}
          name={name}
          options={options}
          value={value}
          invalid={!!error}
          isSearchable={isSearchable}
          isClearable={isClearable}
          isDisabled={disabled}
          isMulti={isMulti}
          tagColorPalette="blackAlpha"
          selectedOptionColorPalette="blue"
          getOptionLabel={({ name: nameOption }: ISelectOption) => nameOption}
          getOptionValue={({ id }: ISelectOption) => String(id)}
          required={required}
          onChange={option => onChange(option as ISelectOption)}
          placeholder=""
          noOptionsMessage={() => 'Nenhum Registro Encontrado'}
          loadingMessage={() => 'Carregando...'}
          chakraStyles={{
            control: provided => ({
              ...provided,
              cursor: cursorType(),
            }),
            menu: provided => ({
              ...provided,
              zIndex: 9999,
            }),
            multiValueRemove: provided => ({
              ...provided,
              color: 'white',
              opacity: 0.8,
              display: disabled ? 'none' : 'inherit',
            }),
            dropdownIndicator: provided => ({
              ...provided,
              bg: 'transparent',
              px: 2,
              cursor: 'inherit',
            }),
            indicatorSeparator: provided => ({
              ...provided,
              display: 'none',
            }),
            loadingIndicator: provided => ({
              ...provided,
              mr: 0,
            }),
          }}
        />
      )}
      {error?.message && <Field.ErrorText>{error.message}</Field.ErrorText>}
    </Field.Root>
  );
};
