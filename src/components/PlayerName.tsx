import { Box, type BoxProps, Text } from '@chakra-ui/react';

interface IPlayerNameProps extends BoxProps {
  name: string;
  username: string;
}

export function PlayerName({ name, username, ...rest }: IPlayerNameProps) {
  return (
    <Box {...rest}>
      <Text fontWeight="semibold" lineClamp={1}>
        {name}
      </Text>
      <Text fontSize="xs" color="gray.400" lineClamp={1}>
        {username}
      </Text>
    </Box>
  );
}
