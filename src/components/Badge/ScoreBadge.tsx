import { Box, Text } from '@chakra-ui/react';

interface IScoreBadgeProps {
  score: number;
  rating: number;
}

export function ScoreBadge({ score, rating }: IScoreBadgeProps) {
  const bgGradient = () => {
    switch (rating) {
      case 0.5:
        return 'linear(to-b, orange.500, yellow.500, blue.500, purple.500, pink.500)';
      case 1:
      case 1.5:
        return 'linear(to-b, pink.500, green.500, blue.500)';
      case 2:
      case 2.5:
        return 'linear(to-b, pink.400, pink.400, purple.400, purple.400, blue.400)';
      case 3:
      case 3.5:
        return 'linear(to-b, blue.400, pink.400, white, pink.400, blue.400)';
      case 4:
      case 4.5:
        return 'linear(to-b, pink.400, orange.400, yellow.400, green.400, blue.400)';
      case 5:
        return 'linear(to-b, red.500, orange.500, yellow.500, green.500, blue.500, purple.500)';
      default:
        return 'linear(to-b, yellow.300, gray.300, purple.500, black)';
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
      <Text fontSize="lg" fontWeight="bold" textShadow="0px 0px 4px black">
        {score}
      </Text>
    </Box>
  );
}
