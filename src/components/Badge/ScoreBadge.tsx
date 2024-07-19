import { Text, Box } from '@chakra-ui/react';

interface IScoreBadgeProps {
  score: number;
  star: number;
}

export function ScoreBadge({ score, star }: IScoreBadgeProps) {
  const bgGradient = () => {
    switch (star) {
      case 0:
        return 'linear(to-b, orange.500, yellow.500, blue.500, purple.500, pink.500)';
      case 1:
        return 'linear(to-b, pink.400, orange.400, yellow.400, green.400, blue.400)';
      case 2:
        return 'linear(to-b, pink.400, pink.400, purple.400, purple.400, blue.400)';
      case 3:
        return 'linear(to-b, blue.400, pink.400, white, pink.400, blue.400)';
      case 4:
        return 'linear(to-b, pink.400, orange.400, white, purple.400, pink.400)';
      case 5:
        return 'linear(to-b, red.500, orange.500, yellow.500, green.500, blue.500, purple.500)';
      default:
        return 'linear(to-b, gray.300, gray.400, gray.500, gray.600, gray.700)';
    }
  };

  return (
    <Box
      bgGradient={bgGradient()}
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="6"
      w="14"
    >
      <Text fontWeight="bold" textShadow="1px 1px 4px rgba(0, 0, 0, 1)">
        {score}
      </Text>
    </Box>
  );
}
