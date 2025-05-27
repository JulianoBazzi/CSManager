import type { ReactNode } from 'react';
import { RiCloseLine, RiMenuFill } from 'react-icons/ri';

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
} from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { useAuth } from '~/contexts/AuthContext';
import type INav from '~/models/INav';
import type INavItem from '~/models/INavItem';

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
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map(
        (navItem) => ((navItem.auth && user) || !navItem.auth) && (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
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
            </PopoverTrigger>
          </Popover>
        </Box>
        ),
      )}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: INavItem) => (
  <Stack spacing={4}>
    <Flex
      py={2}
      as={Link}
      href={href ?? '#'}
      justify="space-between"
      align="center"
      _hover={{
        textDecoration: 'none',
      }}
    >
      <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
        {label}
      </Text>
    </Flex>
  </Stack>
);

const MobileNav = ({ user }: INav) => (
  <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
    {NAV_ITEMS.map(
      (navItem) => ((navItem.auth && user) || !navItem.auth) && <MobileNavItem key={navItem.label} {...navItem} />,
    )}
  </Stack>
);

export default function Template({ user, children }: ITemplateProps) {
  const { logout } = useAuth();
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  return (
    <Box>
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
          <IconButton
            onClick={onToggle}
            icon={<Icon as={isOpen ? RiCloseLine : RiMenuFill} fontSize="2xl" />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
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

        <Stack flex={{ base: 1, md: 0 }} justify="flex-end" direction="row" spacing={3} align="center" pr="2">
          {user ? (
            <Menu>
              <MenuButton>
                <Avatar name={user.user_metadata.name} size="sm" cursor="pointer" />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={() => router.push('/profile')}>Meu Perfil</MenuItem>
                  <MenuItem onClick={() => router.push('/changePassword')}>Alterar Senha</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => logout()}>Sair</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          ) : (
            <Button onClick={() => router.push('/login')}>Entrar</Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav user={user} />
      </Collapse>
      <Flex w="100vw" align="center" flexDir="column" p="6">
        <Flex w="100%" maxW={1480} direction="column" align="center" gap="2">
          {children}
          <Text color="gray.400" fontSize="sm">
            v
            {packageInfo.version}
            {' '}
            - Desenvolvido por
            {' '}
            <Link href="https://mercurius.app.br">Bazzi Solutions</Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
