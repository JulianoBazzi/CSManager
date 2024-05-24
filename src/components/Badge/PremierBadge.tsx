import {
  FlexProps, Flex, Text,
  Box,
} from '@chakra-ui/react';

interface IPremierBadgeProps extends FlexProps {
  premier: number;
}

export function PremierBadge({ premier, ...rest }: IPremierBadgeProps) {
  function bgColor() {
    if (premier < 5000) {
      return '#3a424b';
    }
    if (premier < 10000) {
      return '#2d4355';
    }
    if (premier < 15000) {
      return '#212a5a';
    }
    if (premier < 20000) {
      return '#412157';
    }
    if (premier < 25000) {
      return '#59005d';
    }
    if (premier < 30000) {
      return '#560b0c';
    }

    return '#4c3900';
  }

  function textColor() {
    if (premier < 5000) {
      return '#b8c7d7';
    }
    if (premier < 10000) {
      return '#89bbe6';
    }
    if (premier < 15000) {
      return '#687de9';
    }
    if (premier < 20000) {
      return '#bd6bfd';
    }
    if (premier < 25000) {
      return '#e214f0';
    }
    if (premier < 30000) {
      return '#eb4a49';
    }

    return '#ffd700';
  }

  return (
    <Flex minW="65px" maxW="65px" maxH="4" align="center" bg={bgColor()} transform="skewX(-20deg)" {...rest}>
      <Box w="1" h="4" bg={textColor()} />
      <Box ml="2px" w="1" h="4" bg={textColor()} />
      <Text ml="2" as="small" textColor={textColor()}>
        {premier}
      </Text>
    </Flex>
  );
}
