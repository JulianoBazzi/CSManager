import { useEffect } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';
import ISweepstakeAPI from '~/models/Entity/ISweepstakeAPI';
import { getSweepstake } from '~/services/hooks/useSweepstakes';
import supabase from '~/services/supabase';

interface ISweepstakesProps extends GetServerSideProps {
  user: User;
  sweepstake: ISweepstakeAPI;
}

const Sweepstakes: NextPage<ISweepstakesProps> = ({ user, sweepstake }) => {
  useEffect(() => {
    console.log('sweepstake', sweepstake);
  }, [sweepstake]);

  function handleAdd() {
    // playerModalRef.current?.onOpenModal({
    //   userId: user.id,
    // });
  }

  return (
    <>
      <Head>
        <title>{`${sweepstake.format_departure_at} - ${sweepstake.format_short_game_type}`}</title>
        <meta
          name="description"
          content={`${sweepstake.format_short_game_type}: ${sweepstake.quantity_players} jogadores e ${sweepstake.quantity_maps} mapas.`}
        />
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader title={sweepstake.format_game_type || ''}>
            <IconButton
              colorScheme="green"
              icon={<AddIcon />}
              aria-label="Novo"
              title="Novo Sorteio"
              onClick={handleAdd}
            />
          </CardHeader>
          <CardBody>
            <Text>{sweepstake.format_departure_at}</Text>
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default Sweepstakes;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { id } = context.query;
    const sweepstake = await getSweepstake(String(id));

    if (sweepstake) {
      const { 'csm.token': token } = parseCookies(context);
      if (!token) {
        return {
          props: {
            sweepstake,
          },
        };
      }

      const {
        data: { user },
      } = await supabase.auth.getUser(token);

      if (!user) {
        return {
          props: {
            sweepstake,
          },
        };
      }

      return {
        props: {
          sweepstake,
          user,
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
