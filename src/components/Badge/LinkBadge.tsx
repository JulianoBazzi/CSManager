import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { RiSteamFill } from 'react-icons/ri';

interface ILinkBadgeProps {
  value?: string;
  link?: string;
}

export function LinkBadge({ value, link }: ILinkBadgeProps) {
  if (value) {
    return (
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <Flex align="center" gap="1">
          <Text>{value}</Text>
          <Icon fontSize="md">
            <RiSteamFill />
          </Icon>
        </Flex>
      </Link>
    );
  }

  return <Text />;
}
