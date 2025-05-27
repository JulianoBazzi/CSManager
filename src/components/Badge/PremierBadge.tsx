import {
  type FlexProps, Flex, Text,
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
      firstPart = Number.parseInt(valueStr.slice(0, 2), 10);
      secondPart = valueStr.slice(2).padStart(3, '0');
    } else {
      firstPart = Number.parseInt(valueStr[0], 10);
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
      return '#B1C3D9';
    }
    if (premier < 10000) {
      return '#5E98D7';
    }
    if (premier < 15000) {
      return '#4B69FF';
    }
    if (premier < 20000) {
      return '#8846FF';
    }
    if (premier < 25000) {
      return '#D22CE6';
    }
    if (premier < 30000) {
      return '#EB4B4B';
    }

    return '#FED700';
  }

  return (
    <Flex
      w="55px"
      align="center"
      bgImage={`/assets/premier/${imageBg()}.webp`}
      bgRepeat="no-repeat"
      bgSize="contain"
      {...rest}
    >
      <Text ml="3" transform="skewX(-15deg)" textShadow="0 1px black" fontWeight="bold" textColor={textColor()}>
        {splitNumber()[0]}
        <Text as="small">
          {`,${splitNumber()[1]}`}
        </Text>
      </Text>
    </Flex>
  );
}
