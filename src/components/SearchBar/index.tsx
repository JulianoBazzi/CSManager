import { Icon, Input, InputGroup } from '@chakra-ui/react';
import { type ChangeEvent, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

import useDebounce from '~/hooks/useDebounce';

interface ISearchBarProps {
  onSearch: (value: string) => void;
  disabled?: boolean;
}

export function SearchBar({ onSearch, disabled }: ISearchBarProps) {
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
    <InputGroup
      maxW={['100%', '30%']}
      startElement={
        <Icon>
          <RiSearchLine />
        </Icon>
      }
    >
      <Input
        type="search"
        name="search"
        placeholder="Pesquisar"
        disabled={disabled}
        value={displayValue}
        onChange={changeSearch}
        autoComplete="off"
      />
    </InputGroup>
  );
}
