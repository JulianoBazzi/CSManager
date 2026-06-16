import {
  Avatar,
  Box,
  Button,
  Collapsible,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  Portal,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { RiMenuFill } from 'react-icons/ri';

import { useAuth } from '~/contexts/AuthContext';
import type INav from '~/models/INav';
import type INavItem from '~/models/INavItem';
import { useColorModeValue } from '~/styles/colorMode';

import packageInfo from '../../../package.json';

interface ITemplateProps {
  user?: User;
  children: ReactNode;
}

const NAV_ITEMS: Array<INavItem> = [
  {
    label: 'Início',
    href: '/',
  },
  {
    label: 'Jogadores',
    href: '/players',
    auth: true,
  },
  {
    label: 'Mapas',
    href: '/maps',
    auth: true,
  },
  {
    label: 'Sorteios',
    href: '/sweepstakes',
    auth: true,
  },
  {
    label: 'Ranking',
    href: '/ranking',
    auth: true,
  },
  {
    label: 'Comparativo',
    href: '/comparative',
    auth: true,
  },
];

const DesktopNav = ({ user }: INav) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction="row" gap={4}>
      {NAV_ITEMS.map(
        navItem =>
          ((navItem.auth && user) || !navItem.auth) && (
            <Box key={navItem.label}>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </Box>
          )
      )}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: INavItem) => (
  <Stack gap={4}>
    <Link
      href={href ?? '#'}
      py={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      _hover={{
        textDecoration: 'none',
      }}
    >
      <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
        {label}
      </Text>
    </Link>
  </Stack>
);

const MobileNav = ({ user }: INav) => (
  <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
    {NAV_ITEMS.map(
      navItem => ((navItem.auth && user) || !navItem.auth) && <MobileNavItem key={navItem.label} {...navItem} />
    )}
  </Stack>
);

export default function Template({ user, children }: ITemplateProps) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Box>
      <Collapsible.Root>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align="center"
        >
          <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
            <Collapsible.Trigger asChild>
              <IconButton variant="ghost" aria-label="Toggle Navigation">
                <Icon fontSize="2xl">
                  <RiMenuFill />
                </Icon>
              </IconButton>
            </Collapsible.Trigger>
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontWeight="bold"
              fontFamily="heading"
              color={useColorModeValue('gray.800', 'white')}
            >
              CS Manager
            </Text>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav user={user} />
            </Flex>
          </Flex>

          <Stack flex={{ base: 1, md: 0 }} justify="flex-end" direction="row" gap={3} align="center" pr="2">
            {user ? (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Avatar.Root size="sm" cursor="pointer">
                    <Avatar.Fallback name={user.user_metadata.name} />
                  </Avatar.Root>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="profile" onClick={() => router.push('/profile')}>
                        Meu Perfil
                      </Menu.Item>
                      <Menu.Item value="password" onClick={() => router.push('/changePassword')}>
                        Alterar Senha
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item value="logout" onClick={() => logout()}>
                        Sair
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) : (
              <Button onClick={() => router.push('/login')}>Entrar</Button>
            )}
          </Stack>
        </Flex>

        <Collapsible.Content>
          <MobileNav user={user} />
        </Collapsible.Content>
      </Collapsible.Root>
      <Flex w="100vw" align="center" flexDir="column" p="6">
        <Flex w="100%" maxW={1480} direction="column" align="center" gap="2">
          {children}
          <Text color="gray.400" fontSize="sm">
            v{packageInfo.version} - Desenvolvido por <Link href="https://mercurius.app.br">Bazzi Solutions</Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
