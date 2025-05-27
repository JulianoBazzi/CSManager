import { type ChangeEvent, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

import {
  Icon, Input, InputGroup, InputLeftElement,
} from '@chakra-ui/react';

import useDebounce from '~/hooks/useDebounce';

interface ISearchBarProps {
  onSearch: (value: string) => void;
  isDisabled?: boolean;
}

export function SearchBar({ onSearch, isDisabled }: ISearchBarProps) {
  const [displayValue, setDisplayValue] = useState('');

  const debouncedChange = useDebounce(onSearch, 200);

  function handleSearch(value: string) {
    setDisplayValue(value);
    debouncedChange(value);
  }

  const changeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    handleSearch(event.target.value);
  };

  return (
    <InputGroup maxW={['100%', '30%']} gap="1">
      <InputLeftElement pointerEvents="none">
        <Icon as={RiSearchLine} />
      </InputLeftElement>
      <Input
        type="search"
        name="search"
        placeholder="Pesquisar"
        isDisabled={isDisabled}
        value={displayValue}
        onChange={changeSearch}
        autoComplete="off"
      />
    </InputGroup>
  );
}
