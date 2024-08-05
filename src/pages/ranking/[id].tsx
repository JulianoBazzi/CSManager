import {
  RiNumbersLine,
} from 'react-icons/ri';

import { TableContainer } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { PremierBadge } from '~/components/Badge/PremierBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import Template from '~/components/Template';
import IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import { useRanking } from '~/services/hooks/useRanking';
import supabase from '~/services/supabase';

interface IRankingProps extends GetServerSideProps {
  user: User;
  userId: string;
}

const RankingPublic: NextPage<IRankingProps> = ({ user, userId }) => {
  const {
    data: ranking,
    isLoading: isLoadingRanking,
    isFetching: isFetchingRanking,
  } = useRanking(userId);

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
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
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
            isFetching={isFetchingRanking && !isLoadingRanking}
          />
          <CardBody>
            <TableContainer>
              <Table
                data={ranking}
                columns={rankingColumns}
                isLoading={isLoadingRanking}
                perPage={50}
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
