import {
  Avatar,
  Box,
  Button,
  type ButtonProps,
  Collapsible,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  Portal,
  Separator,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { RiArrowDownSLine, RiMenuFill } from 'react-icons/ri';

import { useAuth } from '~/contexts/AuthContext';
import type INav from '~/models/INav';
import type INavItem from '~/models/INavItem';

import packageInfo from '../../../package.json';

interface ITemplateProps {
  user?: User;
  children: ReactNode;
}

const NAV_ITEMS: Array<INavItem> = [
  { label: 'Início', href: '/' },
  { label: 'Jogadores', href: '/players', auth: true },
  { label: 'Mapas', href: '/maps', auth: true },
  { label: 'Sorteios', href: '/sweepstakes', auth: true },
  { label: 'Ranking', href: '/ranking', auth: true },
  { label: 'Comparativo', href: '/comparative', auth: true },
];

const visibleItems = (user?: User) => NAV_ITEMS.filter(item => (item.auth ? !!user : true));

const isActiveRoute = (pathname: string | null, href?: string) => {
  if (!href || !pathname) {
    return false;
  }
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
};

const DesktopNav = ({ user }: INav) => {
  const pathname = usePathname();

  return (
    <Stack direction="row" gap={1} display={{ base: 'none', md: 'flex' }}>
      {visibleItems(user).map(navItem => {
        const active = isActiveRoute(pathname, navItem.href);
        return (
          <Link
            key={navItem.label}
            asChild
            px={3}
            py={2}
            rounded="md"
            fontSize="sm"
            fontWeight={active ? 'bold' : 500}
            color={active ? 'blue.300' : 'gray.300'}
            _hover={{ textDecoration: 'none', color: 'white', bg: 'gray.700' }}
          >
            <NextLink href={navItem.href ?? '#'} aria-current={active ? 'page' : undefined}>
              {navItem.label}
            </NextLink>
          </Link>
        );
      })}
    </Stack>
  );
};

const UserMenu = ({ user }: { user: User }) => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Menu.Root positioning={{ placement: 'bottom-end', gutter: 4 }}>
      <Menu.Trigger asChild>
        <Button variant="ghost" px="2" gap="2" rounded="full" h="auto" py="1">
          <Avatar.Root size="sm">
            <Avatar.Fallback name={user.user_metadata.name} />
          </Avatar.Root>
          <Text display={{ base: 'none', md: 'block' }} fontSize="sm" fontWeight="medium">
            {user.user_metadata.name}
          </Text>
          <Icon color="gray.400">
            <RiArrowDownSLine />
          </Icon>
        </Button>
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
            <Menu.Item value="logout" color="red.300" onClick={() => logout()}>
              Sair
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

const MobileNav = ({ user, onNavigate }: INav & { onNavigate: () => void }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (href: string) => {
    router.push(href);
    onNavigate();
  };

  const itemProps = (active: boolean): ButtonProps => ({
    variant: 'ghost',
    justifyContent: 'flex-start',
    w: '100%',
    color: active ? 'blue.300' : 'gray.200',
    fontWeight: active ? 'bold' : 'medium',
  });

  return (
    <Stack bg="gray.800" px="4" py="3" gap="1" display={{ md: 'none' }} borderBottomWidth="1px" borderColor="gray.900">
      {visibleItems(user).map(navItem => (
        <Button
          key={navItem.label}
          {...itemProps(isActiveRoute(pathname, navItem.href))}
          onClick={() => navigate(navItem.href ?? '#')}
        >
          {navItem.label}
        </Button>
      ))}
      {user && (
        <>
          <Separator my="2" borderColor="gray.700" />
          <Button {...itemProps(false)} onClick={() => navigate('/profile')}>
            Meu Perfil
          </Button>
          <Button {...itemProps(false)} onClick={() => navigate('/changePassword')}>
            Alterar Senha
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
            color="red.300"
            onClick={() => {
              logout();
              onNavigate();
            }}
          >
            Sair
          </Button>
        </>
      )}
    </Stack>
  );
};

export default function Template({ user, children }: ITemplateProps) {
  const router = useRouter();
  const { open, onToggle, onClose } = useDisclosure();

  return (
    <Box>
      <Collapsible.Root open={open} onOpenChange={event => (event.open ? onToggle() : onClose())}>
        <Flex
          as="header"
          position="sticky"
          top="0"
          zIndex="docked"
          bg="gray.800"
          color="white"
          minH="60px"
          py={2}
          px={4}
          borderBottomWidth="1px"
          borderColor="gray.900"
          align="center"
          gap="2"
        >
          <Collapsible.Trigger asChild>
            <IconButton variant="ghost" aria-label="Abrir menu" display={{ base: 'flex', md: 'none' }}>
              <Icon fontSize="2xl">
                <RiMenuFill />
              </Icon>
            </IconButton>
          </Collapsible.Trigger>

          <Link
            asChild
            fontWeight="bold"
            fontFamily="heading"
            fontSize="lg"
            color="white"
            _hover={{ textDecoration: 'none' }}
          >
            <NextLink href="/">CS Manager</NextLink>
          </Link>

          <Flex ml={6} flex="1">
            <DesktopNav user={user} />
          </Flex>

          <Box>{user ? <UserMenu user={user} /> : <Button onClick={() => router.push('/login')}>Entrar</Button>}</Box>
        </Flex>

        <Collapsible.Content>
          <MobileNav user={user} onNavigate={onClose} />
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
