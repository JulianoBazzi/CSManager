import { BsTrophyFill } from 'react-icons/bs';
import { GiUnlitBomb } from 'react-icons/gi';
import { MdEmojiPeople } from 'react-icons/md';
import {
  RiCalendarEventLine,
  RiEditBoxLine,
  RiMap2Line,
  RiUser3Fill,
  RiUser3Line,
  RiUserSettingsLine,
} from 'react-icons/ri';

import { Divider, Flex, Icon, IconButton, Stack, Text, useBreakpointValue, Image } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import Template from '~/components/Template';
import ISweepstakeAPI from '~/models/Entity/ISweepstakeAPI';
import ISweepstakeMapAPI from '~/models/Entity/ISweepstakeMapAPI';
import { useSweepstakeMaps } from '~/services/hooks/useSweepstakeMaps';
import { useSweepstakePlayers } from '~/services/hooks/useSweepstakePlayers';
import { getSweepstake } from '~/services/hooks/useSweepstakes';
import supabase from '~/services/supabase';

interface ISweepstakesProps extends GetServerSideProps {
  user: User;
  sweepstake: ISweepstakeAPI;
}

const Sweepstakes: NextPage<ISweepstakesProps> = ({ user, sweepstake }) => {
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

  function handleTeamRaffle() {
    // playerModalRef.current?.onOpenModal({
    //   userId: user.id,
    // });
  }

  function handleUpdateScore() {
    // playerModalRef.current?.onOpenModal({
    //   userId: user.id,
    // });
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
      <Template user={user}>
        <Card>
          <CardHeader title={(isMobile ? sweepstake.format_short_game_type : sweepstake.format_game_type) || ''}>
            {user && user.id === sweepstake.user_id && (
              <IconButton
                colorScheme="gray"
                icon={<Icon as={RiUserSettingsLine} fontSize="2xl" />}
                aria-label="Novo Sorteio"
                title="Sortear Times Novamente"
                onClick={handleTeamRaffle}
              />
            )}
          </CardHeader>
          <CardBody>
            <Flex align="center" gap="2">
              <Icon as={RiCalendarEventLine} fontSize="xl" />
              <Text>{sweepstake.format_departure_at}</Text>
            </Flex>
            <Stack direction={['column', 'row']}>
              <Flex align="center" gap="2">
                <Icon as={RiMap2Line} fontSize="xl" />
                <Text>{sweepstake.quantity_maps} mapas</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Icon as={RiUser3Line} fontSize="xl" />
                <Text>{sweepstake.quantity_players} jogadores</Text>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
        <Stack direction={['column', 'row']} w="100%">
          <Card>
            <CardHeader
              icon={RiUser3Line}
              title="Time 1"
              isFetching={isFetchingSweepstakePlayers && !isLoadingSweepstakePlayers}
            />
            <CardBody>
              <Stack divider={<Divider />}>
                {sweepstakePlayers
                  ?.filter((sweepstakePlayer) => sweepstakePlayer.team === 0)
                  .map((sweepstakePlayer, index) => (
                    <Flex key={sweepstakePlayer.id} align="center" gap="2">
                      <Text>
                        {index + 1} - {sweepstakePlayer.players.name} ({sweepstakePlayer.players.username})
                      </Text>
                      <Image
                        src={`/assets/patents/${sweepstakePlayer.players.patent}.webp`}
                        alt={sweepstakePlayer.players.patent}
                        objectFit="scale-down"
                        maxH="24px"
                      />
                    </Flex>
                  ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              icon={RiUser3Fill}
              title="Time 2"
              isFetching={isFetchingSweepstakePlayers && !isLoadingSweepstakePlayers}
            />
            <CardBody>
              <Stack divider={<Divider />}>
                {sweepstakePlayers
                  ?.filter((sweepstakePlayer) => sweepstakePlayer.team === 1)
                  .map((sweepstakePlayer, index) => (
                    <Flex key={sweepstakePlayer.id} align="center" gap="2">
                      <Text>
                        {index + 1} - {sweepstakePlayer.players.name} ({sweepstakePlayer.players.username})
                      </Text>
                      <Image
                        src={`/assets/patents/${sweepstakePlayer.players.patent}.webp`}
                        alt={sweepstakePlayer.players.patent}
                        objectFit="scale-down"
                        maxH="24px"
                      />
                    </Flex>
                  ))}
              </Stack>
            </CardBody>
          </Card>
        </Stack>
        <Card>
          <CardHeader
            icon={RiMap2Line}
            title="Mapas"
            isFetching={isFetchingSweepstakeMaps && !isLoadingSweepstakeMaps}
          />
          <CardBody>
            <Stack direction={['column', 'row']}>
              {sweepstakeMaps?.map((sweepstakeMap) => (
                <Card key={sweepstakeMap.id}>
                  <CardHeader
                    p="3"
                    icon={sweepstakeMap?.maps.map_type === 'bomb' ? GiUnlitBomb : MdEmojiPeople}
                    title={sweepstakeMap?.maps?.name}
                    size="sm"
                  >
                    {user && user.id === sweepstake.user_id && (
                      <IconButton
                        colorScheme="gray"
                        icon={<Icon as={RiEditBoxLine} fontSize="xl" />}
                        aria-label="Placar"
                        title="Atualizar Placares"
                        onClick={handleUpdateScore}
                        size="sm"
                      />
                    )}
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<Divider />}>
                      <Flex align="center" gap="2">
                        <Icon
                          as={RiUser3Line}
                          color={sweepstakeMap.team_start_from_terrorist === 0 ? 'red.500' : 'inherit'}
                        />
                        <Text>
                          {sweepstakeMap.team_one_score_1} + {sweepstakeMap.team_one_score_2}
                        </Text>
                        {isNoWinner(sweepstakeMap) && <Icon as={BsTrophyFill} color="gray.400" />}
                        {isWinnerTeam(sweepstakeMap, 0) && <Icon as={BsTrophyFill} color="yellow.400" />}
                      </Flex>
                      <Flex align="center" gap="2">
                        <Icon
                          as={RiUser3Fill}
                          color={sweepstakeMap.team_start_from_terrorist === 1 ? 'red.500' : 'inherit'}
                        />
                        <Text>
                          {sweepstakeMap.team_two_score_1} + {sweepstakeMap.team_two_score_2}
                        </Text>
                        {isNoWinner(sweepstakeMap) && <Icon as={BsTrophyFill} color="gray.400" />}
                        {isWinnerTeam(sweepstakeMap, 1) && <Icon as={BsTrophyFill} color="yellow.400" />}
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
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
