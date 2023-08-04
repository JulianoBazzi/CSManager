import { useRef } from 'react';

import { Text, useBreakpointValue } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { RaffleIconButton } from '~/components/IconButton/RaffleIconButton';
import { SweepstakeMapModal, SweepstakeMapModalHandle } from '~/components/Modal/SweepstakeMapModal';
import Template from '~/components/Template';
import { TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import IChangeTeamPlayer from '~/models/Entity/Sweepstake/IChangeTeamPlayer';
import ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import { useSweepstakeMaps } from '~/services/hooks/useSweepstakeMaps';
import { useSweepstakePlayers } from '~/services/hooks/useSweepstakePlayers';
import { getSweepstake } from '~/services/hooks/useSweepstakes';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

interface INewSweepstakeProps extends GetServerSideProps {
  user: User;
}

const NewSweepstake: NextPage<INewSweepstakeProps> = ({ user }) => {
  const sweepstakeMapModalRef = useRef<SweepstakeMapModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const {
    data: sweepstakePlayers,
    isLoading: isLoadingSweepstakePlayers,
    isFetching: isFetchingSweepstakePlayers,
  } = useSweepstakePlayers(sweepstake.id);

  const {
    data: sweepstakeMaps,
    isLoading: isLoadingSweepstakeMaps,
    isFetching: isFetchingSweepstakeMaps,
  } = useSweepstakeMaps(sweepstake.id);

  const { mutateAsync: changeTeamMutateAsync, isLoading: isLoadingChangeTeam } = useMutation(
    async ({ sweepstake_player_id, team }: IChangeTeamPlayer) => {
      await supabase
        .from(TABLE_SWEEPSTAKE_PLAYERS)
        .update({
          user_id: user?.id,
          team,
        })
        .eq('id', sweepstake_player_id);
    },
    {
      async onSuccess() {
        successFeedbackToast('Trocar de Time', 'Jogador movido com sucesso!');
        await queryClient.invalidateQueries([TABLE_SWEEPSTAKE_PLAYERS, sweepstake.id]);
      },
      onError(error) {
        errorFeedbackToast('Trocar de Time', error);
      },
    },
  );

  function handleTeamRaffle() {
    // playerModalRef.current?.onOpenModal({
    //   userId: user.id,
    // });
  }

  async function handleChangeTeam(data: IChangeTeamPlayer) {
    await changeTeamMutateAsync(data);
  }

  function handleUpdateScore(sweepstakeMap: ISweepstakeMapAPI) {
    sweepstakeMapModalRef.current?.onOpenModal({
      id: sweepstakeMap.id,
      user,
      sweepstakeMap,
    });
  }

  function isWinnerTeam(sweepstakeMap: ISweepstakeMapAPI, team: number): boolean {
    const sumTeamOne = sweepstakeMap.team_one_score_1 + sweepstakeMap.team_one_score_2;
    const sumTeamTwo = sweepstakeMap.team_two_score_1 + sweepstakeMap.team_two_score_2;

    if ((team === 0 && sumTeamOne > sumTeamTwo) || (team === 1 && sumTeamOne < sumTeamTwo)) {
      return true;
    }

    return false;
  }

  function isNoWinner(sweepstakeMap: ISweepstakeMapAPI): boolean {
    const sumTeamOne = sweepstakeMap.team_one_score_1 + sweepstakeMap.team_one_score_2;
    const sumTeamTwo = sweepstakeMap.team_two_score_1 + sweepstakeMap.team_two_score_2;

    if (sumTeamOne > 0 && sumTeamOne === sumTeamTwo) {
      return true;
    }

    return false;
  }

  return (
    <>
      <Head>
        <title>{`${sweepstake.format_short_game_type}: ${sweepstake.format_departure_at}`}</title>
        <meta
          name="description"
          content={`Partida com ${sweepstake.quantity_players} jogadores e ${sweepstake.quantity_maps} mapas.`}
        />
      </Head>
      <SweepstakeMapModal ref={sweepstakeMapModalRef} />
      <Template user={user}>
        <Card>
          <CardHeader title={(isMobile ? sweepstake.format_short_game_type : sweepstake.format_game_type) || ''}>
            {user && user.id === sweepstake.user_id && <RaffleIconButton onClick={handleTeamRaffle} />}
          </CardHeader>
          <CardBody>
            <Text>asdadasasd</Text>
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default NewSweepstake;

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
