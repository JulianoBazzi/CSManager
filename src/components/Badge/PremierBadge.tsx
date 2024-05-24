import {
  FlexProps, Flex, Text,
} from '@chakra-ui/react';

interface IPremierBadgeProps extends FlexProps {
  premier: number;
}

export function PremierBadge({ premier, ...rest }: IPremierBadgeProps) {
  function splitNumber(): [number, string] {
    if (premier < 1000) {
      return [0, premier.toString().padStart(3, '0')];
    }

    const valueStr = premier.toString();
    let firstPart: number;
    let secondPart: string;

    if (premier >= 10000) {
      firstPart = parseInt(valueStr.slice(0, 2), 10);
      secondPart = valueStr.slice(2).padStart(3, '0');
    } else {
      firstPart = parseInt(valueStr[0], 10);
      secondPart = valueStr.slice(1).padStart(3, '0');
    }

    return [firstPart, secondPart];
  }

  function imageBg() {
    if (premier < 5000) {
      return 'common';
    }
    if (premier < 10000) {
      return 'uncommon';
    }
    if (premier < 15000) {
      return 'rare';
    }
    if (premier < 20000) {
      return 'mythical';
    }
    if (premier < 25000) {
      return 'legendary';
    }
    if (premier < 30000) {
      return 'ancient';
    }

    return 'unusual';
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
    <Flex
      w="55px"
      align="center"
      bgImage={`/assets/premier/${imageBg()}.webp`}
      bgRepeat="no-repeat"
      bgPos="center"
      bgSize="contain"
      {...rest}
    >
      <Text ml="3.5" transform="skewX(-20deg)" textShadow="0 1px black" fontWeight="bold" textColor={textColor()}>
        {splitNumber()[0]}
        <Text as="small">
          {`,${splitNumber()[1]}`}
        </Text>
      </Text>
    </Flex>
  );
}
