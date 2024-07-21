/* eslint-disable max-len */
import { RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';

import {
  Icon,
  Flex,
  FlexProps,
} from '@chakra-ui/react';

interface IStarBadgeProps extends FlexProps {
  rating: number;
}

export function StarBadge({ rating, ...rest }: IStarBadgeProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const getStarColor = (index: number) => {
    if (index < fullStars || (index === fullStars && hasHalfStar)) {
      return 'yellow.400';
    }

    return 'gray.500';
  };

  const getStarIcon = (index: number) => {
    if (index < fullStars) {
      return RiStarFill;
    }
    if (index === fullStars && hasHalfStar) {
      return RiStarHalfFill;
    }
    return RiStarLine;
  };

  return (
    <Flex gap="1px" {...rest}>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon key={index} as={getStarIcon(index)} color={getStarColor(index)} />
      ))}
    </Flex>
  );
}
