import { Box, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBreakpointValue } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { usePathname, useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { RiAwardLine } from 'react-icons/ri';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import ApexChart from '~/components/Chart/ApexChart';
import { Select } from '~/components/Form/Select';
import Template from '~/components/Template';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IEntityBase from '~/models/Entity/Base/IEntityBase';
import type IViewMapRankingAPI from '~/models/Entity/Ranking/IViewMapRankingAPI';
import type ISelectOption from '~/models/ISelectOption';
import { usePlayerMapRanking } from '~/services/hooks/usePlayerMapRanking';
import { usePlayers } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';
import formatPercentage from '~/utils/formatPercentage';
import getDivision from '~/utils/getDivision';

interface IComparativePlayersProps extends GetServerSideProps {
  user: User;
  userId: string;
  usernameOne: string;
  usernameTwo: string;
}

interface IPlayerSelectOption extends ISelectOption {
  count: number;
  quantity: number;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;
}

interface IRankingMapComparison extends IEntityBase {
  name: string;
  player_one_quantity: number;
  player_one_kills: number;
  player_one_deaths: number;
  player_one_assistances: number;
  player_one_headshot_percentage: number;
  player_one_damage: number;
  player_two_quantity: number;
  player_two_kills: number;
  player_two_deaths: number;
  player_two_assistances: number;
  player_two_headshot_percentage: number;
  player_two_damage: number;
}

interface IComparativeMessageAPI {
  quantity?: string;
  kill?: string;
  death?: string;
  assistance?: string;
  headshot?: string;
  damage?: string;
}

const ComparativePlayersPublic: NextPage<IComparativePlayersProps> = ({ user, userId, usernameOne, usernameTwo }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { errorFeedbackToast } = useFeedback();
  const router = useRouter();
  const pathname = usePathname();

  const [tabIndex, setTabIndex] = useState(0);
  const [playerOptions, setPlayerOptions] = useState<ISelectOption[]>([]);
  const [playerOne, setPlayerOne] = useState<IPlayerSelectOption | undefined>();
  const [playerTwo, setPlayerTwo] = useState<IPlayerSelectOption | undefined>();
  const [rankingMapComparison, setRankingMapComparison] = useState<IRankingMapComparison[]>([]);
  const [comparativeMessage, setComparativeMessage] = useState<IComparativeMessageAPI | undefined>();

  const { data: players, isLoading, isFetching } = usePlayers(userId);

  const { data: playerOneRanking, isLoading: isLoadingRankingOne } = usePlayerMapRanking(String(playerOne?.id) ?? '', {
    enabled: !!playerOne,
  });
  const { data: playerTwoRanking, isLoading: isLoadingRankingTwo } = usePlayerMapRanking(String(playerTwo?.id) ?? '', {
    enabled: !!playerTwo,
  });

  const { mutateAsync: generateComparativeMessage, isPending: isLoadingComparativeMessage } = useMutation({
    mutationFn: async () => {
      setComparativeMessage(undefined);

      const response = await axios.post<IComparativeMessageAPI>('/api/comparative-messages', {
        player_one: {
          name: playerOne?.name,
          damage: playerOne?.damage,
          kill: playerOne?.kills,
          assistance: playerOne?.assistances,
          death: playerOne?.deaths,
          headshot: playerOne?.headshot_percentage,
          quantity: playerOne?.quantity,
        },
        player_two: {
          name: playerTwo?.name,
          damage: playerTwo?.damage,
          kill: playerTwo?.kills,
          assistance: playerTwo?.assistances,
          death: playerTwo?.deaths,
          headshot: playerTwo?.headshot_percentage,
          quantity: playerTwo?.quantity,
        },
      });

      return response.data;
    },
    async onSuccess(data) {
      setComparativeMessage(data);
    },
    onError(error: Error) {
      errorFeedbackToast('OpenAI - Mensagens Engraçadas', error);
    },
  });

  useEffect(() => {
    setComparativeMessage(undefined);
    setPlayerOptions(
      players ? players.map(player => ({ id: player.id, name: player.name, description: player.username })) : []
    );
  }, [players]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <ignore>
  useEffect(() => {
    if (usernameOne) {
      const one = playerOptions.find(player => player.description === usernameOne);
      if (one) {
        setPlayerOne({
          ...one,
          count: 0,
          quantity: 0,
          kills: 0,
          deaths: 0,
          assistances: 0,
          headshot_percentage: 0,
          damage: 0,
        });
      }
    }
    if (usernameTwo) {
      const two = playerOptions.find(player => player.description === usernameTwo);
      if (two) {
        setPlayerTwo({
          ...two,
          count: 0,
          quantity: 0,
          kills: 0,
          deaths: 0,
          assistances: 0,
          headshot_percentage: 0,
          damage: 0,
        });
      }
    }
  }, [playerOptions]);

  useEffect(() => {
    if (playerOne && playerTwo) {
      router.push(`${pathname}?p1=${playerOne.description}&p2=${playerTwo.description}`);
    }
  }, [router, pathname, playerOne, playerTwo]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <ignore>
  useEffect(() => {
    if (playerOneRanking && playerTwoRanking) {
      const result: IRankingMapComparison[] = [];
      const playerStatsMap: { [key: string]: { one?: IViewMapRankingAPI; two?: IViewMapRankingAPI } } = {};

      for (let i = 0; i < playerOneRanking.length; i++) {
        const stat = playerOneRanking[i];
        if (!playerStatsMap[stat.name]) {
          playerStatsMap[stat.name] = {};
        }
        playerStatsMap[stat.name].one = stat;
      }

      for (let i = 0; i < playerTwoRanking.length; i++) {
        const stat = playerTwoRanking[i];
        if (!playerStatsMap[stat.name]) {
          playerStatsMap[stat.name] = {};
        }
        playerStatsMap[stat.name].two = stat;
      }

      setPlayerOne(previousOne => {
        if (previousOne) {
          return {
            ...previousOne,
            count: 0,
            quantity: 0,
            kills: 0,
            deaths: 0,
            assistances: 0,
            headshot_percentage: 0,
            damage: 0,
          };
        }
        return undefined;
      });

      setPlayerTwo(previousTwo => {
        if (previousTwo) {
          return {
            ...previousTwo,
            count: 0,
            quantity: 0,
            kills: 0,
            deaths: 0,
            assistances: 0,
            headshot_percentage: 0,
            damage: 0,
          };
        }
        return undefined;
      });

      const statNames = Object.keys(playerStatsMap);
      for (let i = 0; i < statNames.length; i++) {
        const name = statNames[i];
        const { one } = playerStatsMap[name];
        const { two } = playerStatsMap[name];

        if (one && two) {
          setPlayerOne(previousOne => {
            if (previousOne) {
              return {
                ...previousOne,
                count: (previousOne.count ?? 0) + 1,
                quantity: (previousOne.quantity ?? 0) + (one?.quantity ?? 0),
                kills: (previousOne.kills ?? 0) + (one?.kills ?? 0),
                deaths: (previousOne.deaths ?? 0) + (one?.deaths ?? 0),
                assistances: (previousOne.assistances ?? 0) + (one?.assistances ?? 0),
                headshot_percentage: (previousOne.headshot_percentage ?? 0) + (one?.headshot_percentage ?? 0),
                damage: (previousOne.damage ?? 0) + (one?.damage ?? 0),
              };
            }
            return undefined;
          });

          setPlayerTwo(previousTwo => {
            if (previousTwo) {
              return {
                ...previousTwo,
                count: (previousTwo.count ?? 0) + 1,
                quantity: (previousTwo.quantity ?? 0) + (two?.quantity ?? 0),
                kills: (previousTwo.kills ?? 0) + (two?.kills ?? 0),
                deaths: (previousTwo.deaths ?? 0) + (two?.deaths ?? 0),
                assistances: (previousTwo.assistances ?? 0) + (two?.assistances ?? 0),
                headshot_percentage: (previousTwo.headshot_percentage ?? 0) + (two?.headshot_percentage ?? 0),
                damage: (previousTwo.damage ?? 0) + (two?.damage ?? 0),
              };
            }
            return undefined;
          });

          result.push({
            id: one.map_id,
            name,
            player_one_quantity: one?.quantity ?? 0,
            player_one_kills: one?.kills ?? 0,
            player_one_deaths: one?.deaths ?? 0,
            player_one_assistances: one?.assistances ?? 0,
            player_one_headshot_percentage: one?.headshot_percentage ?? 0,
            player_one_damage: one?.damage ?? 0,
            player_two_quantity: two?.quantity ?? 0,
            player_two_kills: two?.kills ?? 0,
            player_two_deaths: two?.deaths ?? 0,
            player_two_assistances: two?.assistances ?? 0,
            player_two_headshot_percentage: two?.headshot_percentage ?? 0,
            player_two_damage: two?.damage ?? 0,
          });
        }
      }

      setRankingMapComparison(result.sort((a, b) => a.name.localeCompare(b.name)));
      generateComparativeMessage();
    }
  }, [playerOneRanking, playerTwoRanking]);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const damageCard = () => {
    const one = tabIndex === 0 ? (playerOne?.damage ?? 0) : (playerTwo?.damage ?? 0);
    const two = tabIndex === 0 ? (playerTwo?.damage ?? 0) : (playerOne?.damage ?? 0);

    const balance = one - two;

    if (balance > 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">🔥</Text>
              <Box>
                <Text>{comparativeMessage?.damage ? comparativeMessage?.damage : 'Maior Dano Causado'}</Text>
                <Text fontSize="sm">
                  <b>{one}</b> vs {two}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  const killCard = () => {
    const one = tabIndex === 0 ? (playerOne?.kills ?? 0) : (playerTwo?.kills ?? 0);
    const two = tabIndex === 0 ? (playerTwo?.kills ?? 0) : (playerOne?.kills ?? 0);

    const balance = one - two;

    if (balance > 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">☠️</Text>
              <Box>
                <Text>{comparativeMessage?.kill ? comparativeMessage?.kill : 'Mais Vítimas Eliminadas'}</Text>
                <Text fontSize="sm">
                  <b>{one}</b> vs {two}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  const assistanceCard = () => {
    const one = tabIndex === 0 ? (playerOne?.assistances ?? 0) : (playerTwo?.assistances ?? 0);
    const two = tabIndex === 0 ? (playerTwo?.assistances ?? 0) : (playerOne?.assistances ?? 0);

    const balance = one - two;

    if (balance > 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">🤝</Text>
              <Box>
                <Text>{comparativeMessage?.assistance ? comparativeMessage?.assistance : 'Mais Assistências'}</Text>
                <Text fontSize="sm">
                  <b>{one}</b> vs {two}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  const deathCard = () => {
    const one = tabIndex === 0 ? (playerOne?.deaths ?? 0) : (playerTwo?.deaths ?? 0);
    const two = tabIndex === 0 ? (playerTwo?.deaths ?? 0) : (playerOne?.deaths ?? 0);

    const balance = one - two;

    if (balance < 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">⚰️</Text>
              <Box>
                <Text>{comparativeMessage?.death ? comparativeMessage?.death : 'Menos Mortes Sofridas'}</Text>
                <Text fontSize="sm">
                  <b>{one}</b> vs {two}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  const headshotCard = () => {
    const one = tabIndex === 0 ? (playerOne?.headshot_percentage ?? 0) : (playerTwo?.headshot_percentage ?? 0);
    const two = tabIndex === 0 ? (playerTwo?.headshot_percentage ?? 0) : (playerOne?.headshot_percentage ?? 0);
    const count = playerOne?.count ?? 0;

    const balance = one - two;

    if (balance > 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">🎯</Text>
              <Box>
                <Text>
                  {comparativeMessage?.headshot ? comparativeMessage?.headshot : 'Maior Percentual de Tiros na Cabeça'}
                </Text>
                <Text fontSize="sm">
                  <b>{formatPercentage(getDivision(one, count), true)}</b> vs{' '}
                  {formatPercentage(getDivision(two, count), true)}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  const quantityCard = () => {
    const one = tabIndex === 0 ? (playerOne?.quantity ?? 0) : (playerTwo?.quantity ?? 0);
    const two = tabIndex === 0 ? (playerTwo?.quantity ?? 0) : (playerOne?.quantity ?? 0);

    const balance = one - two;

    if (balance > 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">🎮</Text>
              <Box>
                <Text>{comparativeMessage?.quantity ? comparativeMessage?.quantity : 'Mais Partidas Disputadas'}</Text>
                <Text fontSize="sm">
                  <b>{one}</b> vs {two}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  const noRecordCard = () => {
    const killOne = tabIndex === 0 ? (playerOne?.kills ?? 0) : (playerTwo?.kills ?? 0);
    const killTwo = tabIndex === 0 ? (playerTwo?.kills ?? 0) : (playerOne?.kills ?? 0);

    const assistanceOne = tabIndex === 0 ? (playerOne?.assistances ?? 0) : (playerTwo?.assistances ?? 0);
    const assistanceTwo = tabIndex === 0 ? (playerTwo?.assistances ?? 0) : (playerOne?.assistances ?? 0);

    const deathOne = tabIndex === 0 ? (playerOne?.deaths ?? 0) : (playerTwo?.deaths ?? 0);
    const deathTwo = tabIndex === 0 ? (playerTwo?.deaths ?? 0) : (playerOne?.deaths ?? 0);

    const headshotOne = tabIndex === 0 ? (playerOne?.headshot_percentage ?? 0) : (playerTwo?.headshot_percentage ?? 0);
    const headshotTwo = tabIndex === 0 ? (playerTwo?.headshot_percentage ?? 0) : (playerOne?.headshot_percentage ?? 0);

    const quantityOne = tabIndex === 0 ? (playerOne?.quantity ?? 0) : (playerTwo?.quantity ?? 0);
    const quantitytwo = tabIndex === 0 ? (playerTwo?.quantity ?? 0) : (playerOne?.quantity ?? 0);

    const count = playerOne?.count ?? 0;

    if (
      killOne < killTwo &&
      assistanceOne < assistanceTwo &&
      deathOne > deathTwo &&
      getDivision(headshotOne, count) < getDivision(headshotTwo, count) &&
      quantityOne < quantitytwo
    ) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">😂</Text>
              <Box>
                <Text>Pior em tudo</Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      );
    }

    return <Text display="none" />;
  };

  return (
    <>
      <Head>
        {usernameOne && usernameTwo ? (
          <title>{`${usernameOne} vs ${usernameTwo} - CS Manager`}</title>
        ) : (
          <title>Comparativo entre Jogadores - CS Manager</title>
        )}
        <meta name="description" content="Compare os jogadores para identificar quem é o mais habilidoso." />
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader
            icon={RiAwardLine}
            title={isMobile ? 'Comparativo' : 'Comparativo entre Jogadores'}
            isFetching={isLoadingComparativeMessage}
          />
          <CardBody>
            <Stack direction={['column', 'row']}>
              <Flex w={['100%', '50%']} p="2" borderRadius={8} bg="blue.800">
                <Select
                  name="player_one"
                  label="Jogador 1"
                  options={playerOptions.filter(player => player.id !== playerTwo?.id)}
                  value={playerOne}
                  isDisabled={isLoading}
                  isLoading={isFetching}
                  isRequired
                  isSearchable
                  isClearable
                  onChange={option => {
                    if (option) {
                      setPlayerOne({
                        ...option,
                        count: 0,
                        quantity: 0,
                        kills: 0,
                        deaths: 0,
                        assistances: 0,
                        headshot_percentage: 0,
                        damage: 0,
                      });
                      return;
                    }

                    setComparativeMessage(undefined);
                    setPlayerOne(undefined);
                  }}
                />
              </Flex>
              <Flex w={['100%', '50%']} p="2" borderRadius={8} bg="green.800">
                <Select
                  name="player_two"
                  label="Jogador 2"
                  options={playerOptions.filter(player => player.id !== playerOne?.id)}
                  value={playerTwo}
                  isDisabled={isLoading}
                  isLoading={isFetching}
                  isRequired
                  isSearchable
                  isClearable
                  onChange={option => {
                    if (option) {
                      setPlayerTwo({
                        ...option,
                        count: 0,
                        quantity: 0,
                        kills: 0,
                        deaths: 0,
                        assistances: 0,
                        headshot_percentage: 0,
                        damage: 0,
                      });
                      return;
                    }

                    setComparativeMessage(undefined);
                    setPlayerTwo(undefined);
                  }}
                />
              </Flex>
            </Stack>

            {(!playerOne || !playerTwo) && (
              <Flex p="10" justify="center">
                <Text />
              </Flex>
            )}

            {!!playerOne && !!playerTwo && (
              <>
                <Tabs
                  mt="4"
                  isFitted
                  variant="soft-rounded"
                  colorScheme="blue"
                  index={tabIndex}
                  onChange={handleTabsChange}
                >
                  <TabList overflowY="hidden" overflowX="auto">
                    <Tab px="16" _selected={{ bg: 'blue.800', color: 'white' }}>
                      {isMobile ? playerOne?.name : `${playerOne?.name} (${playerOne?.description})`}
                    </Tab>
                    <Tab px="16" _selected={{ bg: 'green.800', color: 'white' }}>
                      {isMobile ? playerTwo?.name : `${playerTwo?.name} (${playerTwo?.description})`}
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Text fontSize="x-large" fontWeight="bold">
                        Por que o{' '}
                        <Text as="span" fontWeight="bold" color="blue.600">
                          {playerOne?.name}
                        </Text>{' '}
                        é melhor que o{' '}
                        <Text as="span" fontWeight="bold" color="green.600">
                          {playerTwo.name}
                        </Text>
                        ?
                      </Text>
                      <Stack mt="4">
                        {damageCard()}
                        {killCard()}
                        {assistanceCard()}
                        {deathCard()}
                        {headshotCard()}
                        {quantityCard()}
                        {noRecordCard()}
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                      <Text fontSize="x-large" fontWeight="bold">
                        Por que o{' '}
                        <Text as="span" fontWeight="bold" color="green.600">
                          {playerTwo.name}
                        </Text>{' '}
                        é melhor que o{' '}
                        <Text as="span" fontWeight="bold" color="blue.600">
                          {playerOne?.name}
                        </Text>
                        ?
                      </Text>
                      <Stack mt="4">
                        {damageCard()}
                        {killCard()}
                        {assistanceCard()}
                        {deathCard()}
                        {headshotCard()}
                        {quantityCard()}
                        {noRecordCard()}
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                <Tabs mt="4" isFitted variant="solid-rounded">
                  <TabList overflowY="hidden" overflowX="auto">
                    <Tab>Dano</Tab>
                    <Tab>Vítimas</Tab>
                    <Tab>Mortes</Tab>
                    <Tab>Assistências</Tab>
                    <Tab>%TC</Tab>
                    <Tab>Partidas</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="line"
                        categories={rankingMapComparison.map(map => map.name)}
                        series={[
                          {
                            name: playerOne.name,
                            data: rankingMapComparison.map(map => map.player_one_damage),
                          },
                          {
                            name: playerTwo?.name,
                            data: rankingMapComparison.map(map => map.player_two_damage),
                          },
                        ]}
                        showDataLabels
                        height="300px"
                        width="100%"
                        colors={['#1A3478', '#124A28']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="line"
                        categories={rankingMapComparison.map(map => map.name)}
                        series={[
                          {
                            name: playerOne.name,
                            data: rankingMapComparison.map(map => map.player_one_kills),
                          },
                          {
                            name: playerTwo?.name,
                            data: rankingMapComparison.map(map => map.player_two_kills),
                          },
                        ]}
                        showDataLabels
                        height="300px"
                        width="100%"
                        colors={['#1A3478', '#124A28']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="line"
                        categories={rankingMapComparison.map(map => map.name)}
                        series={[
                          {
                            name: playerOne.name,
                            data: rankingMapComparison.map(map => map.player_one_deaths),
                          },
                          {
                            name: playerTwo?.name,
                            data: rankingMapComparison.map(map => map.player_two_deaths),
                          },
                        ]}
                        showDataLabels
                        height="300px"
                        width="100%"
                        colors={['#1A3478', '#124A28']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="line"
                        categories={rankingMapComparison.map(map => map.name)}
                        series={[
                          {
                            name: playerOne.name,
                            data: rankingMapComparison.map(map => map.player_one_assistances),
                          },
                          {
                            name: playerTwo?.name,
                            data: rankingMapComparison.map(map => map.player_two_assistances),
                          },
                        ]}
                        showDataLabels
                        height="300px"
                        width="100%"
                        colors={['#1A3478', '#124A28']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="line"
                        categories={rankingMapComparison.map(map => map.name)}
                        series={[
                          {
                            name: playerOne.name,
                            data: rankingMapComparison.map(map => map.player_one_headshot_percentage),
                          },
                          {
                            name: playerTwo?.name,
                            data: rankingMapComparison.map(map => map.player_two_headshot_percentage),
                          },
                        ]}
                        showDataLabels
                        height="300px"
                        width="100%"
                        colors={['#1A3478', '#124A28']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="line"
                        categories={rankingMapComparison.map(map => map.name)}
                        series={[
                          {
                            name: playerOne.name,
                            data: rankingMapComparison.map(map => map.player_one_quantity),
                          },
                          {
                            name: playerTwo?.name,
                            data: rankingMapComparison.map(map => map.player_two_quantity),
                          },
                        ]}
                        showDataLabels
                        height="300px"
                        width="100%"
                        colors={['#1A3478', '#124A28']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </>
            )}
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default ComparativePlayersPublic;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { id, p1 = null, p2 = null } = context.query;

    if (id) {
      const userId = String(id);

      const { 'csm.token': token } = parseCookies(context);
      if (!token) {
        return {
          props: {
            userId,
            usernameOne: p1,
            usernameTwo: p2,
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
            usernameOne: p1,
            usernameTwo: p2,
          },
        };
      }

      return {
        props: {
          user,
          userId,
          usernameOne: p1,
          usernameTwo: p2,
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
