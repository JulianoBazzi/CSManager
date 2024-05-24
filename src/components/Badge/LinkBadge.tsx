import { RiSteamFill } from 'react-icons/ri';

import {
  Flex, Icon, Link, Text,
} from '@chakra-ui/react';

interface ILinkBadgeProps{
  value?: string;
  link?: string;
}

export function LinkBadge({ value, link }: ILinkBadgeProps) {
  if (value) {
    return (
      <Link href={link} isExternal>
        <Flex align="center" gap="1">
          <Text>
            {value}
          </Text>
          <Icon as={RiSteamFill} fontSize="md" />
        </Flex>
      </Link>
    );
  }

  return (
    <Text />
  );
}
