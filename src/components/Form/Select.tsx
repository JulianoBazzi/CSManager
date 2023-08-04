/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react';

import {
  FormControl, FormErrorMessage, FormLabel, Skeleton,
} from '@chakra-ui/react';
import { Select as ChakraReactSelect, SelectInstance } from 'chakra-react-select';

import ISelectOption from '~/models/ISelectOption';

interface ISelectProps {
  name: string;
  label?: string;
  error?: any;
  maxW?: string | string[];
  options: ISelectOption[];
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  value?: ISelectOption | ISelectOption[];
  onChange: (option: any) => void;
}

function SelectBase(
  {
    name,
    label,
    error,
    maxW,
    options,
    isSearchable = false,
    isClearable,
    isMulti,
    isDisabled,
    isRequired,
    isLoading,
    value,
    onChange,
  }: ISelectProps,
  ref: React.ForwardedRef<SelectInstance<ISelectOption>>,
) {
  const cursorType = () => {
    if (isDisabled) {
      return 'not-allowed';
    }
    if (isSearchable) {
      return 'text';
    }

    return 'pointer';
  };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} maxW={maxW}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {isLoading && <Skeleton height="10" borderRadius={4} />}
      {!isLoading && (
        <ChakraReactSelect
          ref={ref}
          id={name}
          name={name}
          options={options}
          value={value}
          isInvalid={!!error}
          isSearchable={isSearchable}
          isClearable={isClearable}
          isDisabled={isDisabled}
          isMulti={isMulti}
          getOptionLabel={({ name: nameOption }: ISelectOption) => nameOption}
          getOptionValue={({ id }: ISelectOption) => String(id)}
          isRequired={isRequired}
          onChange={(option) => onChange(option as ISelectOption)}
          placeholder=""
          noOptionsMessage={() => 'Nenhum Registro Encontrado'}
          loadingMessage={() => 'Carregando...'}
          chakraStyles={{
            control: (provided) => ({
              ...provided,
              // backgroundColor: isDisabled ? 'gray.50' : 'white',
              // borderColor: error ? 'red.300' : 'gray.100',
              cursor: cursorType(),
              // _focus: {
              //   borderColor: 'orange.500',
              // },
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            // multiValue: (provided) => ({
            //   ...provided,
            //   backgroundColor: isDisabled ? 'gray.400' : 'orange.500',
            //   color: 'white',
            // }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: 'white',
              opacity: 0.8,
              display: isDisabled ? 'none' : 'inherit',
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              bg: 'transparent',
              px: 2,
              cursor: 'inherit',
              // color: error ? 'red.300' : 'gray.300',
            }),
            indicatorSeparator: (provided) => ({
              ...provided,
              display: 'none',
            }),
            loadingIndicator: (provided) => ({
              ...provided,
              // color: 'orange.200',
              mr: 0,
            }),
          }}
        />
      )}
      {error && error.message && <FormErrorMessage my="1">{error.message}</FormErrorMessage>}
    </FormControl>
  );
}

export const Select = forwardRef(SelectBase);
