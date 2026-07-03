'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { RiNumbersLine } from 'react-icons/ri';
import { removeAccents } from '@julianobazzi/utils';

import { years } from '~/assets/years';
import { RankBadge } from '~/components/Badge/RankBadge';
import { StarBadge } from '~/components/Badge/StarBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Select } from '~/components/Form/Select';
import { Table } from '~/components/Form/Table';
import { PlayerName } from '~/components/PlayerName';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import type IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import type ISelectOption from '~/models/ISelectOption';
import { useRanking } from '~/services/hooks/useRanking';

interface IRankingProps {
  user?: User;
  userId: string;
}

export function RankingForm({ user, userId }: IRankingProps) {
  const [selectedYear, setSelectedYear] = useState<ISelectOption>(years[0]);
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching } = useRanking(userId, Number(selectedYear?.id));

  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        player =>
          removeAccents(player.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())) ||
          removeAccents(player.username.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
      )
    );
  }, [search, data]);

  const rankingColumns: ColumnDef<IViewRankingAPI>[] = [
    {
      id: 'position',
      header: '#',
      enableSorting: false,
      cell: ({ row, table }) => (
        <RankBadge position={table.getSortedRowModel().rows.findIndex(r => r.id === row.id) + 1} />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Jogador',
      cell: ({ row }) => <PlayerName name={row.original.name} username={row.original.username} />,
    },
    {
      accessorKey: 'rating',
      header: 'Avaliação',
      cell: ({ row }) => <StarBadge rating={row.original.rating} />,
    },
    {
      accessorKey: 'sweepstake_count',
      header: 'Partidas',
    },
    {
      accessorKey: 'kills',
      header: 'Vítimas',
      cell: ({ row }) => (
        <Text color="green.300" fontWeight="medium">
          {row.original.kills}
        </Text>
      ),
    },
    {
      accessorKey: 'deaths',
      header: 'Mortes',
      cell: ({ row }) => <Text color="red.300">{row.original.deaths}</Text>,
    },
    {
      accessorKey: 'assistances',
      header: 'Assist.',
    },
    {
      accessorKey: 'headshot_percentage',
      header: '%TC',
      cell: ({ row }) => <Text fontWeight="medium">{row.original.headshot_percentage}</Text>,
    },
    {
      accessorKey: 'damage',
      header: 'Dano',
      cell: ({ row }) => (
        <Text color="orange.300" fontWeight="semibold">
          {row.original.damage}
        </Text>
      ),
    },
  ];

  return (
    <Template user={user}>
      <Card>
        <CardHeader icon={RiNumbersLine} title="Ranking" isFetching={isFetching && !isLoading} />
        <CardBody>
          <Flex
            gap="3"
            bg="gray.800"
            p="3"
            borderRadius="lg"
            direction={['column', 'row']}
            align={['stretch', 'center']}
          >
            <SearchBar onSearch={value => setSearch(value)} disabled={isFetching} />
            <Flex w={['100%', '120px']} ml={['0', 'auto']}>
              <Select
                name="year"
                options={years}
                value={selectedYear}
                required
                onChange={option => option && setSelectedYear(option)}
              />
            </Flex>
          </Flex>
          <Box overflowX="auto">
            <Table
              data={dataFiltered}
              columns={rankingColumns}
              loading={isLoading}
              perPage={50}
              orderBy={{
                id: 'damage',
                desc: true,
              }}
              columnVisibility={{
                rating: user?.id === userId,
              }}
              disableTotalRecords
              disablePagination
            />
          </Box>
        </CardBody>
      </Card>
    </Template>
  );
}
