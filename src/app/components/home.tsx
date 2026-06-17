'use client';

import { Box, Link, List, Separator, Text } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { RiHome5Line } from 'react-icons/ri';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';

interface IHomeProps {
  user?: User;
}

export function Home({ user }: IHomeProps) {
  return (
    <Template user={user}>
      <Card>
        <CardHeader icon={RiHome5Line} title="CS Manager" />
        <CardBody>
          <Box>
            <Text>Tecnologias Utilizadas:</Text>
            <List.Root mt="2">
              <List.Item>
                <Link href="https://nextjs.org">Next.js</Link>
              </List.Item>
              <List.Item>
                <Link href="https://www.typescriptlang.org">TypeScript</Link>
              </List.Item>
              <List.Item>
                <Link href="https://chakra-ui.com">Chakra UI</Link>
              </List.Item>
              <List.Item>
                <Link href="https://supabase.com">Supabase</Link>
              </List.Item>
            </List.Root>
          </Box>
          <Separator mt="-2" />
          <Box>
            <Text>Link do Projeto:</Text>
            <List.Root mt="2">
              <List.Item>
                <Link href="https://github.com/JulianoBazzi/CSManager">GitHub</Link>
              </List.Item>
            </List.Root>
          </Box>
        </CardBody>
      </Card>
    </Template>
  );
}
