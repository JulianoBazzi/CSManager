import { useEffect, useState } from 'react';
import {
  RiNumbersLine,
} from 'react-icons/ri';

import { Flex, TableContainer } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import removeAccents from 'remove-accents';

import { years } from '~/assets/years';
import { PremierBadge } from '~/components/Badge/PremierBadge';
import { StarBadge } from '~/components/Badge/StarBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Select } from '~/components/Form/Select';
import { Table } from '~/components/Form/Table';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import type IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import type ISelectOption from '~/models/ISelectOption';
import { useRanking } from '~/services/hooks/useRanking';
import supabase from '~/services/supabase';

interface IRankingProps extends GetServerSideProps {
  user: User;
  userId: string;
}

const RankingPublic: NextPage<IRankingProps> = ({ user, userId }) => {
  const [selectedYear, setSelectedYear] = useState<ISelectOption>(years[0]);
  const [search, setSearch] = useState('');

  const {
    data,
    isLoading,
    isFetching,
  } = useRanking(userId, Number(selectedYear?.id));

  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        (player) => removeAccents(player.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(player.username.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())),
      ),
    );
  }, [search, data]);

  const rankingColumns: ColumnDef<IViewRankingAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'username',
      header: 'Steam',
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
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
    },
    {
      accessorKey: 'deaths',
      header: 'Mortes',
    },
    {
      accessorKey: 'assistances',
      header: 'Assist.',
    },
    {
      accessorKey: 'headshot_percentage',
      header: '%TC',
    },
    {
      accessorKey: 'damage',
      header: 'Dano',
    },
  ];

  return (
    <>
      <Head>
        <title>Ranking - CS Manager</title>
        <meta name="description" content="Veja o ranking com os melhores jogadores." />
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader
            icon={RiNumbersLine}
            title="Ranking"
            isFetching={isFetching && !isLoading}
          />
          <CardBody>
            <Flex gap="2">
              <SearchBar onSearch={(value) => setSearch(value)} isDisabled={isFetching} />
              <Flex w={['190px', '120px']}>
                <Select
                  name="year"
                  options={years}
                  value={selectedYear}
                  isRequired
                  onChange={(option) => setSelectedYear(option)}
                />
              </Flex>
            </Flex>
            <TableContainer>
              <Table
                data={dataFiltered}
                columns={rankingColumns}
                isLoading={isLoading}
                perPage={50}
                orderBy={{
                  id: 'damage',
                  desc: true,
                }}
                columnVisibility={{
                  rating: user?.id === userId,
                }}
              />
            </TableContainer>
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default RankingPublic;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { id } = context.query;

    if (id) {
      const userId = String(id);

      const { 'csm.token': token } = parseCookies(context);
      if (!token) {
        return {
          props: {
            userId,
          },
        };
      }

      const {
        data: { user },
      } = await supabase.auth.getUser(token);

      if (!user) {
        return {
          props: {
            userId,
          },
        };
      }

      return {
        props: {
          user,
          userId,
        },
      };
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
