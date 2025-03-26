import { useEffect, useState } from 'react';
import {
  RiAwardLine,
} from 'react-icons/ri';

import {
  Box,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { usePathname, useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import ApexChart from '~/components/Chart/ApexChart';
import { Select } from '~/components/Form/Select';
import Template from '~/components/Template';
import IEntityBase from '~/models/Entity/Base/IEntityBase';
import IViewMapRankingAPI from '~/models/Entity/Ranking/IViewMapRankingAPI';
import ISelectOption from '~/models/ISelectOption';
import { usePlayerMapRanking } from '~/services/hooks/usePlayerMapRanking';
import { usePlayers } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';
import formatPercentage from '~/utils/formatPercentage';
import getDivision from '~/utils/getDivision';

interface IComparativePlayersProps extends GetServerSideProps {
  user: User;
  userId: string;
  playerOneId: string;
  playerTwoId: string;
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

const ComparativePlayersPublic: NextPage<IComparativePlayersProps> = ({
  user, userId, playerOneId, playerTwoId,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const pathname = usePathname();

  const [tabIndex, setTabIndex] = useState(0);
  const [playerOptions, setPlayerOptions] = useState<ISelectOption[]>([]);
  const [playerOne, setPlayerOne] = useState<IPlayerSelectOption | undefined>();
  const [playerTwo, setPlayerTwo] = useState<IPlayerSelectOption | undefined>();
  const [rankingMapComparison, setRankingMapComparison] = useState<IRankingMapComparison[]>([]);

  const { data: players, isLoading, isFetching } = usePlayers(userId);

  const { data: playerOneRanking, isLoading: isLoadingRankingOne } = usePlayerMapRanking(String(playerOne?.id) ?? '', { enabled: !!playerOne });
  const { data: playerTwoRanking, isLoading: isLoadingRankingTwo } = usePlayerMapRanking(String(playerTwo?.id) ?? '', { enabled: !!playerTwo });

  useEffect(() => {
    setPlayerOptions(players ? players.map((player) => ({ id: player.id, name: player.name, description: player.username })) : []);
  }, [players]);

  // useEffect(() => {
  //   if (playerOneId) {
  //     setPlayerOne(playerOptions.find((player) => player.id === playerOneId));
  //   }
  //   if (playerTwoId) {
  //     setPlayerTwo(playerOptions.find((player) => player.id === playerTwoId));
  //   }
  // }, [playerOptions, playerOneId, playerTwoId]);

  // useEffect(() => {
  //   if (playerOne && playerTwo) {
  //     router.push(`${pathname}?playerOneId=${playerOne.id}&playerTwoId=${playerTwo.id}`);
  //   }
  // }, [router, pathname, playerOne, playerTwo]);

  useEffect(() => {
    if (playerOneRanking && playerTwoRanking) {
      const result: IRankingMapComparison[] = [];
      const playerStatsMap: { [key: string]: { one?: IViewMapRankingAPI, two?: IViewMapRankingAPI } } = {};

      playerOneRanking.forEach((stat) => {
        if (!playerStatsMap[stat.name]) {
          playerStatsMap[stat.name] = {};
        }
        playerStatsMap[stat.name].one = stat;
      });

      playerTwoRanking.forEach((stat) => {
        if (!playerStatsMap[stat.name]) {
          playerStatsMap[stat.name] = {};
        }
        playerStatsMap[stat.name].two = stat;
      });

      Object.keys(playerStatsMap).forEach((name) => {
        const { one } = playerStatsMap[name];
        const { two } = playerStatsMap[name];

        if (one && two) {
          setPlayerOne((previousOne) => {
            if (previousOne) {
              return ({
                ...previousOne,
                count: (previousOne.count ?? 0) + 1,
                quantity: (previousOne.quantity ?? 0) + (one?.quantity ?? 0),
                kills: (previousOne.kills ?? 0) + (one?.kills ?? 0),
                deaths: (previousOne.deaths ?? 0) + (one?.deaths ?? 0),
                assistances: (previousOne.assistances ?? 0) + (one?.assistances ?? 0),
                headshot_percentage: (previousOne.headshot_percentage ?? 0) + (one?.headshot_percentage ?? 0),
                damage: (previousOne.damage ?? 0) + (one?.damage ?? 0),
              });
            }

            return undefined;
          });

          setPlayerTwo((previousTwo) => {
            if (previousTwo) {
              return ({
                ...previousTwo,
                count: (previousTwo.count ?? 0) + 1,
                quantity: (previousTwo.quantity ?? 0) + (two?.quantity ?? 0),
                kills: (previousTwo.kills ?? 0) + (two?.kills ?? 0),
                deaths: (previousTwo.deaths ?? 0) + (two?.deaths ?? 0),
                assistances: (previousTwo.assistances ?? 0) + (two?.assistances ?? 0),
                headshot_percentage: (previousTwo.headshot_percentage ?? 0) + (two?.headshot_percentage ?? 0),
                damage: (previousTwo.damage ?? 0) + (two?.damage ?? 0),
              });
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
      });

      setRankingMapComparison(result.sort((a, b) => a.name.localeCompare(b.name)));
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
                <Text>Dano Causado</Text>
                <Text fontSize="sm">
                  <b>{one}</b>
                  {' '}
                  vs
                  {' '}
                  {two}
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
                <Text>Vítimas</Text>
                <Text fontSize="sm">
                  <b>{one}</b>
                  {' '}
                  vs
                  {' '}
                  {two}
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
                <Text>Assistências</Text>
                <Text fontSize="sm">
                  <b>{one}</b>
                  {' '}
                  vs
                  {' '}
                  {two}
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
                <Text>Mortes</Text>
                <Text fontSize="sm">
                  <b>{one}</b>
                  {' '}
                  vs
                  {' '}
                  {two}
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
    const count = (playerOne?.count ?? 0);

    const balance = one - two;

    if (balance > 0) {
      return (
        <Card bg="gray.800">
          <CardBody px="4" py="2">
            <Flex align="center" gap="4">
              <Text fontSize="2xl">🎯</Text>
              <Box>
                <Text>%TC</Text>
                <Text fontSize="sm">
                  <b>{formatPercentage(getDivision(one ?? 0, count), true)}</b>
                  {' '}
                  vs
                  {' '}
                  {formatPercentage(getDivision(two ?? 0, count), true)}
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
                <Text>Partidas</Text>
                <Text fontSize="sm">
                  <b>{one}</b>
                  {' '}
                  vs
                  {' '}
                  {two}
                </Text>
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
        <title>Comparativo entre Jogadores - CS Manager</title>
        <meta name="description" content="Compare os jogadores para identificar quem é o mais habilidoso." />
      </Head>
      <Template user={user}>
        <Card>
          <CardHeader
            icon={RiAwardLine}
            title="Comparativo entre Jogadores"
          />
          <CardBody>
            <Stack direction={['column', 'row']}>
              <Flex w={['100%', '50%']} p="2" borderRadius={8} bg="blue.800">
                <Select
                  name="player_one"
                  label="Jogador 1"
                  options={playerOptions.filter((player) => player.id !== playerTwo?.id)}
                  value={playerOne}
                  isDisabled={isLoading}
                  isLoading={isFetching}
                  isRequired
                  isSearchable
                  isClearable
                  onChange={(option) => {
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

                    setPlayerOne(undefined);
                  }}
                />
              </Flex>
              <Flex w={['100%', '50%']} p="2" borderRadius={8} bg="green.800">
                <Select
                  name="player_two"
                  label="Jogador 2"
                  options={playerOptions.filter((player) => player.id !== playerOne?.id)}
                  value={playerTwo}
                  isDisabled={isLoading}
                  isLoading={isFetching}
                  isRequired
                  isSearchable
                  isClearable
                  onChange={(option) => {
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

                    setPlayerTwo(undefined);
                  }}
                />
              </Flex>
            </Stack>

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
                      <Text fontSize="x-large" fontWeight="bold">{`Por que o ${playerOne?.name} é melhor que o ${playerTwo.name}?`}</Text>
                      <Stack mt="4">
                        {damageCard()}
                        {killCard()}
                        {assistanceCard()}
                        {deathCard()}
                        {headshotCard()}
                        {quantityCard()}
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                      <Text fontSize="x-large" fontWeight="bold">{`Por que o ${playerTwo?.name} é melhor que o ${playerOne.name}?`}</Text>
                      <Stack mt="4">
                        {damageCard()}
                        {killCard()}
                        {assistanceCard()}
                        {deathCard()}
                        {headshotCard()}
                        {quantityCard()}
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
                        categories={rankingMapComparison.map((map) => map.name)}
                        series={[{
                          name: playerOne.name,
                          data: rankingMapComparison.map((map) => map.player_one_damage),
                        }, {
                          name: playerTwo?.name,
                          data: rankingMapComparison.map((map) => map.player_two_damage),
                        }]}
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
                        categories={rankingMapComparison.map((map) => map.name)}
                        series={[{
                          name: playerOne.name,
                          data: rankingMapComparison.map((map) => map.player_one_kills),
                        }, {
                          name: playerTwo?.name,
                          data: rankingMapComparison.map((map) => map.player_two_kills),
                        }]}
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
                        categories={rankingMapComparison.map((map) => map.name)}
                        series={[{
                          name: playerOne.name,
                          data: rankingMapComparison.map((map) => map.player_one_deaths),
                        }, {
                          name: playerTwo?.name,
                          data: rankingMapComparison.map((map) => map.player_two_deaths),
                        }]}
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
                        categories={rankingMapComparison.map((map) => map.name)}
                        series={[{
                          name: playerOne.name,
                          data: rankingMapComparison.map((map) => map.player_one_assistances),
                        }, {
                          name: playerTwo?.name,
                          data: rankingMapComparison.map((map) => map.player_two_assistances),
                        }]}
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
                        categories={rankingMapComparison.map((map) => map.name)}
                        series={[{
                          name: playerOne.name,
                          data: rankingMapComparison.map((map) => map.player_one_headshot_percentage),
                        }, {
                          name: playerTwo?.name,
                          data: rankingMapComparison.map((map) => map.player_two_headshot_percentage),
                        }]}
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
                        categories={rankingMapComparison.map((map) => map.name)}
                        series={[{
                          name: playerOne.name,
                          data: rankingMapComparison.map((map) => map.player_one_quantity),
                        }, {
                          name: playerTwo?.name,
                          data: rankingMapComparison.map((map) => map.player_two_quantity),
                        }]}
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
    const { id, playerOneId = null, playerTwoId = null } = context.query;

    if (id) {
      const userId = String(id);

      const { 'csm.token': token } = parseCookies(context);
      if (!token) {
        return {
          props: {
            userId,
            playerOneId,
            playerTwoId,
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
            playerOneId,
            playerTwoId,
          },
        };
      }

      return {
        props: {
          user,
          userId,
          playerOneId,
          playerTwoId,
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
