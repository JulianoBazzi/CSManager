import { Text, type TextProps } from '@chakra-ui/react';

interface IRankBadgeProps extends Omit<TextProps, 'position'> {
  position: number;
}

export function RankBadge({ position, ...rest }: IRankBadgeProps) {
  const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : null;

  return medal ? (
    <Text fontSize="lg" textAlign="center" {...rest}>
      {medal}
    </Text>
  ) : (
    <Text color="gray.400" fontWeight="medium" textAlign="center" {...rest}>
      {position}
    </Text>
  );
}
