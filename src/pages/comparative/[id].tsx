import { useEffect, useState } from 'react';
import {
  RiAwardLine,
} from 'react-icons/ri';

import {
  Box,
  Text,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import ApexChart from '~/components/Chart/ApexChart';
import { Select } from '~/components/Form/Select';
import Template from '~/components/Template';
import IViewMapRankingAPI from '~/models/Entity/Ranking/IViewMapRankingAPI';
import ISelectOption from '~/models/ISelectOption';
import { usePlayerMapRanking } from '~/services/hooks/usePlayerMapRanking';
import { usePlayers } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';

interface IComparativePlayersProps extends GetServerSideProps {
  user: User;
  userId: string;
}

interface IRankingMapComparison {
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

const ComparativePlayersPublic: NextPage<IComparativePlayersProps> = ({ user, userId }) => {
  const [playerOptions, setPlayerOptions] = useState<ISelectOption[]>([]);
  const [playerOne, setPlayerOne] = useState<ISelectOption | undefined>();
  const [playerTwo, setPlayerTwo] = useState<ISelectOption | undefined>();
  const [rankingMapComparison, setRankingMapComparison] = useState<IRankingMapComparison[]>([]);

  const { data: players, isLoading, isFetching } = usePlayers(userId);

  const { data: playerOneRanking, isLoading: isLoadingRankingOne } = usePlayerMapRanking(String(playerOne?.id) ?? '', { enabled: !!playerOne });
  const { data: playerTwoRanking, isLoading: isLoadingRankingTwo } = usePlayerMapRanking(String(playerTwo?.id) ?? '', { enabled: !!playerTwo });

  useEffect(() => {
    setPlayerOptions(players ? players.map((player) => ({ id: player.id, name: player.name, description: player.username })) : []);
  }, [players]);

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
          result.push({
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
              <Flex w={['100%', '50%']} p="2" borderRadius={8} bg="blue.700">
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
                  onChange={(option) => setPlayerOne(option)}
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
                  onChange={(option) => setPlayerTwo(option)}
                />
              </Flex>
            </Stack>

            {!!playerOne && !!playerTwo && (
              <>
                <Tabs mt="6" variant="soft-rounded" colorScheme="blue">
                  <TabList>
                    <Tab px="16" _selected={{ bg: 'blue.700', color: 'white' }}>{`${playerOne?.name} (${playerOne?.description})`}</Tab>
                    <Tab px="16" _selected={{ bg: 'green.800', color: 'white' }}>{`${playerTwo?.name} (${playerTwo?.description})`}</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Flex>
                        <Box w={['100%', '60%']}>
                          <ApexChart
                            id="lineChartId"
                            type="radar"
                            categories={['03/2024', '04/2024', '05/2024', '06/2024']}
                            series={[{
                              name: 'Unidades Vendidas',
                              type: 'radar',
                              data: [77129, 74559, 79023, 88047],
                            }, {
                              name: 'Mix de Produtos',
                              type: 'radar',
                              data: [23, 21, 25, 27],
                            }]}
                            showDataLabels
                            height="300px"
                            width="100%"
                          />
                        </Box>
                        <Stack>
                          <Text fontSize="x-large" fontWeight="bold">{`Por que o ${playerOne?.name} é melhor que o ${playerTwo.name}?`}</Text>
                        </Stack>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Flex>
                        <Box w={['100%', '60%']}>
                          <Text>Gráfico</Text>
                        </Box>
                        <Stack>
                          <Text fontSize="x-large" fontWeight="bold">{`Por que o ${playerTwo?.name} é melhor que o ${playerOne.name}?`}</Text>
                        </Stack>
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                <Tabs mt="6" variant="soft-rounded" colorScheme="blue">
                  <TabList>
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
                        type="bar"
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
                        colors={['#2C5282', '#22543D']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="bar"
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
                        colors={['#2C5282', '#22543D']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="bar"
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
                        colors={['#2C5282', '#22543D']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="bar"
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
                        colors={['#2C5282', '#22543D']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="bar"
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
                        colors={['#2C5282', '#22543D']}
                        isLoading={isLoadingRankingOne || isLoadingRankingTwo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        id="damageChartId"
                        type="bar"
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
                        colors={['#2C5282', '#22543D']}
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
