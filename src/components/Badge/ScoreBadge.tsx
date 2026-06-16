import { Box, Text } from '@chakra-ui/react';

interface IScoreBadgeProps {
  score: number;
  rating: number;
}

export function ScoreBadge({ score, rating }: IScoreBadgeProps) {
  const bgGradient = () => {
    switch (rating) {
      case 0.5:
        return 'linear-gradient(to bottom, {colors.orange.500}, {colors.yellow.500}, {colors.blue.500}, {colors.purple.500}, {colors.pink.500})';
      case 1:
      case 1.5:
        return 'linear-gradient(to bottom, {colors.pink.500}, {colors.green.500}, {colors.blue.500})';
      case 2:
      case 2.5:
        return 'linear-gradient(to bottom, {colors.pink.400}, {colors.pink.400}, {colors.purple.400}, {colors.purple.400}, {colors.blue.400})';
      case 3:
      case 3.5:
        return 'linear-gradient(to bottom, {colors.blue.400}, {colors.pink.400}, {colors.white}, {colors.pink.400}, {colors.blue.400})';
      case 4:
      case 4.5:
        return 'linear-gradient(to bottom, {colors.pink.400}, {colors.orange.400}, {colors.yellow.400}, {colors.green.400}, {colors.blue.400})';
      case 5:
        return 'linear-gradient(to bottom, {colors.red.500}, {colors.orange.500}, {colors.yellow.500}, {colors.green.500}, {colors.blue.500}, {colors.purple.500})';
      default:
        return 'linear-gradient(to bottom, {colors.yellow.300}, {colors.gray.300}, {colors.purple.500}, {colors.black})';
    }
  };

  return (
    <Box
      bgImage={bgGradient()}
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
