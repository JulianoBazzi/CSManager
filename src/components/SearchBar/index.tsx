import { Icon, Input, InputGroup } from '@chakra-ui/react';
import { useDebounce } from '@julianobazzi/nextjs-utils';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

interface ISearchBarProps {
  onSearch: (value: string) => void;
  disabled?: boolean;
}

export function SearchBar({ onSearch, disabled }: ISearchBarProps) {
  const [displayValue, setDisplayValue] = useState('');
  const debouncedValue = useDebounce(displayValue, 200);
  const didMount = useRef(false);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    onSearchRef.current(debouncedValue);
  }, [debouncedValue]);

  const changeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(event.target.value);
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
