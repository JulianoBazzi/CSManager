/* eslint-disable max-len */
import { RiStarFill, RiStarLine } from 'react-icons/ri';

import {
  Icon,
  Flex,
} from '@chakra-ui/react';

interface IStarBadgeProps {
  star: number;
}

export function StarBadge({ star }: IStarBadgeProps) {
  return (
    <Flex gap="1px">
      {star > 0 ? <Icon as={RiStarFill} color="yellow.400" /> : <Icon as={RiStarLine} />}
      {star > 1 ? <Icon as={RiStarFill} color="yellow.400" /> : <Icon as={RiStarLine} />}
      {star > 2 ? <Icon as={RiStarFill} color="yellow.400" /> : <Icon as={RiStarLine} />}
      {star > 3 ? <Icon as={RiStarFill} color="yellow.400" /> : <Icon as={RiStarLine} />}
      {star > 4 ? <Icon as={RiStarFill} color="yellow.400" /> : <Icon as={RiStarLine} />}
    </Flex>
  );
}
