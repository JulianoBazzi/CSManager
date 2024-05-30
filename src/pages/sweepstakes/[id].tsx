import { useRef, useState } from 'react';
import { GiUnlitBomb } from 'react-icons/gi';
import { MdEmojiPeople } from 'react-icons/md';
import {
  RiCalendarEventLine,
  RiEditBoxLine,
  RiMap2Line,
  RiNumbersLine,
  RiTrophyFill,
  RiUser3Fill,
  RiUser3Line,
} from 'react-icons/ri';

import {
  Divider, Flex, Icon, IconButton, Stack, TableContainer, Text, useBreakpointValue,
} from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { AlertOriginEnum, AlertTypeEnum } from '~/components/Alert';
import { ConfirmRegisterAlert, ConfirmRegisterAlertHandle } from '~/components/Alert/ConfirmRegisterAlert';
import { PremierBadge } from '~/components/Badge/PremierBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { ChangeTeamIconButton } from '~/components/IconButton/ChangeTeamIconButton';
import { DeleteSolidIconButton } from '~/components/IconButton/DeleteSolidIconButton';
import { NewSweepstakePlayerModal, NewSweepstakePlayerModalHandle } from '~/components/Modal/NewSweepstakePlayerModal';
import { SweepstakeMapModal, SweepstakeMapModalHandle } from '~/components/Modal/SweepstakeMapModal';
import { SweepstakeMapRankingModal, SweepstakeMapRankingModalHandle } from '~/components/Modal/SweepstakeMapRankingModal';
import Template from '~/components/Template';
import { TABLE_SWEEPSTAKES, TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import IViewSeepstakeRankingAPI from '~/models/Entity/Ranking/IViewSeepstakeRankingAPI';
import IChangeTeamPlayer from '~/models/Entity/Sweepstake/IChangeTeamPlayer';
import IDeleteTeamPlayer from '~/models/Entity/Sweepstake/IDeleteTeamPlayer';
import ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import { useSweepstakeMaps } from '~/services/hooks/useSweepstakeMaps';
import { useSweepstakePlayers } from '~/services/hooks/useSweepstakePlayers';
import { useSweepstakeRanking } from '~/services/hooks/useSweepstakeRanking';
import { getSweepstake } from '~/services/hooks/useSweepstakes';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

interface ISweepstakesProps extends GetServerSideProps {
  user: User;
  sweepstake: ISweepstakeAPI;
}

const Sweepstakes: NextPage<ISweepstakesProps> = ({ user, sweepstake: sweepstakeProp }) => {
  const sweepstakeMapModalRef = useRef<SweepstakeMapModalHandle>(null);
  const sweepstakeMapRankingModalRef = useRef<SweepstakeMapRankingModalHandle>(null);
  const newSweepstakePlayerModalRef = useRef<NewSweepstakePlayerModalHandle>(null);
  const confirmRegisterAlertRef = useRef<ConfirmRegisterAlertHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const [sweepstake, setSweepstake] = useState(sweepstakeProp);

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

  const {
    data: sweepstakeRankings,
    isLoading: isLoadingSweepstakeRankings,
    isFetching: isFetchingSweepstakeRankings,
  } = useSweepstakeRanking(sweepstake.id);

  const rankingColumns: ColumnDef<IViewSeepstakeRankingAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      enableSorting: false,
    },
    {
      accessorKey: 'username',
      header: 'Steam',
      enableSorting: false,
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
    },
    {
      accessorKey: 'kills',
      header: 'Vítimas',
      enableSorting: false,
    },
    {
      accessorKey: 'deaths',
      header: 'Mortes',
      enableSorting: false,
    },
    {
      accessorKey: 'assistances',
      header: 'Assist.',
      enableSorting: false,
    },
    {
      accessorKey: 'headshot_percentage',
      header: '%TC',
      enableSorting: false,
    },
    {
      accessorKey: 'damage',
      header: 'Dano',
      enableSorting: false,
    },
  ];

  const { mutateAsync: deletePlayerMutateAsync, isPending: isLoadingDeletePlayer } = useMutation({
    mutationFn: async ({ sweepstake_player_id }: IDeleteTeamPlayer) => {
      await supabase
        .from(TABLE_SWEEPSTAKE_PLAYERS)
        .delete()
        .eq('id', sweepstake_player_id);

      await supabase
        .from(TABLE_SWEEPSTAKES)
        .update({
          quantity_players: sweepstake.quantity_players - 1,
        })
        .eq('id', sweepstake.id);

      setSweepstake((previousSweepstake) => ({
        ...previousSweepstake,
        quantity_players: previousSweepstake.quantity_players - 1,
      }));
    },
    async onSuccess() {
      successFeedbackToast('Remover Jogador', 'Jogador removido com sucesso!');
      await queryClient.invalidateQueries({ queryKey: [TABLE_SWEEPSTAKE_PLAYERS, sweepstake.id] });
    },
    onError(error: Error) {
      errorFeedbackToast('Remover Jogador', error);
    },
  });

  const { mutateAsync: changeTeamMutateAsync, isPending: isLoadingChangeTeam } = useMutation(
    {
      mutationFn: async ({ sweepstake_player_id, team }: IChangeTeamPlayer) => {
        await supabase
          .from(TABLE_SWEEPSTAKE_PLAYERS)
          .update({
            user_id: user?.id,
            team,
          })
          .eq('id', sweepstake_player_id);
      },
      async onSuccess() {
        successFeedbackToast('Trocar de Time', 'Jogador movido com sucesso!');
        await queryClient.invalidateQueries({ queryKey: [TABLE_SWEEPSTAKE_PLAYERS, sweepstake.id] });
      },
      onError(error) {
        errorFeedbackToast('Trocar de Time', error);
      },
    },
  );

  async function handleAddPlayer(team: number) {
    newSweepstakePlayerModalRef.current?.onOpenModal({
      id: sweepstake.id,
      team,
      user,
      onSubmit: async (numberPlayers) => {
        await supabase
          .from(TABLE_SWEEPSTAKES)
          .update({
            quantity_players: sweepstake.quantity_players + numberPlayers,
          })
          .eq('id', sweepstake.id);

        setSweepstake((previousSweepstake) => ({
          ...previousSweepstake,
          quantity_players: previousSweepstake.quantity_players + numberPlayers,
        }));
      },
    });
  }

  async function handleDeletePlayer(data: IDeleteTeamPlayer) {
    confirmRegisterAlertRef.current?.onOpenAlert({
      type: AlertTypeEnum.Delete,
      origin: AlertOriginEnum.Player,
      data,
      onConfirm: async (value) => deletePlayerMutateAsync(value),
    });
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

  function handleShowRankingModal(sweepstakeMap: ISweepstakeMapAPI) {
    sweepstakeMapRankingModalRef.current?.onOpenModal({
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
      <SweepstakeMapRankingModal ref={sweepstakeMapRankingModalRef} />
      <NewSweepstakePlayerModal ref={newSweepstakePlayerModalRef} />
      <ConfirmRegisterAlert ref={confirmRegisterAlertRef} isSubmitting={isLoadingDeletePlayer} />
      <Template user={user}>
        <Card>
          <CardHeader title={(isMobile ? sweepstake.format_short_game_type : sweepstake.format_game_type) || ''} />
          <CardBody>
            <Flex align="center" gap="2">
              <Icon as={RiCalendarEventLine} fontSize="xl" />
              <Text>{sweepstake.format_departure_at}</Text>
            </Flex>
            <Stack direction={['column', 'row']}>
              <Flex align="center" gap="2">
                <Icon as={RiMap2Line} fontSize="xl" />
                <Text>
                  {sweepstake.quantity_maps}
                  {' '}
                  mapas
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                <Icon as={RiUser3Line} fontSize="xl" />
                <Text>
                  {sweepstake.quantity_players}
                  {' '}
                  jogadores
                </Text>
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
            >
              {!isMobile && user && user.id === sweepstake.user_id && (<AddIconButton size="sm" onClick={() => handleAddPlayer(0)} />)}
            </CardHeader>
            <CardBody>
              <Stack divider={<Divider />}>
                {sweepstakePlayers
                  ?.filter((sweepstakePlayer) => sweepstakePlayer.team === 0)
                  .map((sweepstakePlayer, index) => (
                    <Stack direction={['column', 'row']} key={sweepstakePlayer.id}>
                      <Flex align="center" gap="2" justify={isMobile ? 'space-between' : 'inherit'}>
                        <Text noOfLines={1}>
                          {index + 1}
                          {' '}
                          -
                          {' '}
                          {sweepstakePlayer.players.name}
                          {' '}
                          (
                          {sweepstakePlayer.players.username}
                          )
                        </Text>
                        <PremierBadge premier={sweepstakePlayer.players.premier} />
                      </Flex>
                      {!isMobile && user && user.id === sweepstake.user_id && (
                        <>
                          <ChangeTeamIconButton
                            ml="auto"
                            size="xs"
                            onClick={() => handleChangeTeam({ sweepstake_player_id: sweepstakePlayer.id, team: 1 })}
                            isDisabled={isLoadingChangeTeam}
                          />
                          <DeleteSolidIconButton
                            size="xs"
                            onClick={() => handleDeletePlayer({ sweepstake_player_id: sweepstakePlayer.id })}
                            isDisabled={isLoadingChangeTeam}
                          />
                        </>
                      )}
                    </Stack>
                  ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              icon={RiUser3Fill}
              title="Time 2"
              isFetching={isFetchingSweepstakePlayers && !isLoadingSweepstakePlayers}
            >
              {!isMobile && user && user.id === sweepstake.user_id && (<AddIconButton size="sm" onClick={() => handleAddPlayer(1)} />)}
            </CardHeader>
            <CardBody>
              <Stack divider={<Divider />}>
                {sweepstakePlayers
                  ?.filter((sweepstakePlayer) => sweepstakePlayer.team === 1)
                  .map((sweepstakePlayer, index) => (
                    <Stack direction={['column', 'row']} key={sweepstakePlayer.id}>
                      <Flex align="center" gap="2" justify={isMobile ? 'space-between' : 'inherit'}>
                        <Text noOfLines={1}>
                          {index + 1}
                          {' '}
                          -
                          {' '}
                          {sweepstakePlayer.players.name}
                          {' '}
                          (
                          {sweepstakePlayer.players.username}
                          )
                        </Text>
                        <PremierBadge premier={sweepstakePlayer.players.premier} />
                      </Flex>
                      {!isMobile && user && user.id === sweepstake.user_id && (
                        <>
                          <ChangeTeamIconButton
                            ml="auto"
                            size="xs"
                            onClick={() => handleChangeTeam({ sweepstake_player_id: sweepstakePlayer.id, team: 0 })}
                            isDisabled={isLoadingChangeTeam}
                          />
                          <DeleteSolidIconButton
                            size="xs"
                            onClick={() => handleDeletePlayer({ sweepstake_player_id: sweepstakePlayer.id })}
                            isDisabled={isLoadingChangeTeam}
                          />
                        </>
                      )}
                    </Stack>
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
                    p={isMobile ? '5' : '3'}
                    icon={sweepstakeMap?.maps.map_type === 'bomb' ? GiUnlitBomb : MdEmojiPeople}
                    title={sweepstakeMap?.maps?.name}
                    size="sm"
                  >
                    <Flex gap="2">
                      {user && user.id === sweepstake.user_id && (
                        <IconButton
                          colorScheme="gray"
                          icon={<Icon as={RiEditBoxLine} fontSize="xl" />}
                          aria-label="Placar"
                          title="Atualizar Placares"
                          onClick={() => handleUpdateScore(sweepstakeMap)}
                          size="sm"
                        />
                      )}
                      {(sweepstakeMap.team_one_score_1 + sweepstakeMap.team_one_score_2
                        + sweepstakeMap.team_two_score_1 + sweepstakeMap.team_two_score_2 > 0) && (
                        <IconButton
                          colorScheme="gray"
                          icon={<Icon as={RiNumbersLine} fontSize="xl" />}
                          aria-label="Ranking"
                          title="Ver Ranking"
                          onClick={() => handleShowRankingModal(sweepstakeMap)}
                          size="sm"
                        />
                      )}
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<Divider />}>
                      <Flex align="center" gap="2">
                        <Icon
                          as={RiUser3Line}
                          color={sweepstakeMap.team_start_from_terrorist === 0 ? 'red.500' : 'inherit'}
                        />
                        <Text>
                          {sweepstakeMap.team_one_score_1}
                          {' '}
                          +
                          {' '}
                          {sweepstakeMap.team_one_score_2}
                        </Text>
                        {isNoWinner(sweepstakeMap) && <Icon as={RiTrophyFill} color="gray.400" />}
                        {isWinnerTeam(sweepstakeMap, 0) && <Icon as={RiTrophyFill} color="yellow.400" />}
                      </Flex>
                      <Flex align="center" gap="2">
                        <Icon
                          as={RiUser3Fill}
                          color={sweepstakeMap.team_start_from_terrorist === 1 ? 'red.500' : 'inherit'}
                        />
                        <Text>
                          {sweepstakeMap.team_two_score_1}
                          {' '}
                          +
                          {' '}
                          {sweepstakeMap.team_two_score_2}
                        </Text>
                        {isNoWinner(sweepstakeMap) && <Icon as={RiTrophyFill} color="gray.400" />}
                        {isWinnerTeam(sweepstakeMap, 1) && <Icon as={RiTrophyFill} color="yellow.400" />}
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            icon={RiNumbersLine}
            title="Ranking"
            isFetching={isFetchingSweepstakeRankings && !isLoadingSweepstakeRankings}
          />
          <CardBody>
            <TableContainer>
              <Table
                data={sweepstakeRankings}
                columns={rankingColumns}
                isLoading={isLoadingSweepstakeRankings}
              />
            </TableContainer>
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
