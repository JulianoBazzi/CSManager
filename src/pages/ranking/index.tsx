import { useEffect, useState } from 'react';

import { Flex } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
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
import IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import ISelectOption from '~/models/ISelectOption';
import { useRanking } from '~/services/hooks/useRanking';
import supabase from '~/services/supabase';

interface IRankingProps extends GetServerSideProps {
  user: User;
}

const Ranking: NextPage<IRankingProps> = ({ user }) => {
  const [selectedYear, setSelectedYear] = useState<ISelectOption>(years[0]);

  const { data, isLoading, isFetching } = useRanking(user.id, Number(selectedYear?.id));

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        (player) => removeAccents(player.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(player.username.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())),
      ),
    );
  }, [search, data]);

  const columns: ColumnDef<IViewRankingAPI>[] = [
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
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
    },
    {
      accessorKey: 'rating',
      header: 'Avaliação',
      // eslint-disable-next-line react/no-unstable-nested-components
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
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title="Ranking" isFetching={isFetching && !isLoading} />
          <CardBody>
            <Flex gap="2">
              <SearchBar onSearch={(value) => setSearch(value)} isDisabled={isFetching} />
              <Flex w="120px">
                <Select
                  name="year"
                  options={years}
                  value={selectedYear}
                  isRequired
                  onChange={(option) => setSelectedYear(option)}
                />
              </Flex>
            </Flex>
            <Table
              data={dataFiltered}
              columns={columns}
              isLoading={isLoading}
              perPage={50}
              orderBy={{
                id: 'damage',
                desc: true,
              }}
            />
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default Ranking;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { 'csm.token': token } = parseCookies(context);
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
