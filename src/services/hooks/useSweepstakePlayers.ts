import { useQuery } from '@tanstack/react-query';

import { TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import type ISweepstakePlayerAPI from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';
import { formatPlayer } from '~/services/hooks/usePlayers';
import supabase from '~/services/supabase';

export function formatSweepstakePlayer(sweepstakePlayer: ISweepstakePlayerAPI): ISweepstakePlayerAPI {
  return {
    ...sweepstakePlayer,
    players: formatPlayer(sweepstakePlayer.players),
  };
}

export async function getSweepstakePlayers(sweepstakeId: string): Promise<ISweepstakePlayerAPI[]> {
  const { data } = await supabase
    .from(TABLE_SWEEPSTAKE_PLAYERS)
    .select('id, sweepstake_id, team, score, players(id, name, username, rating)')
    .eq('sweepstake_id', sweepstakeId);

  const formattedData: ISweepstakePlayerAPI[] = [];

  data?.forEach((sweepstakePlayer) => {
    formattedData.push(formatSweepstakePlayer(sweepstakePlayer as unknown as ISweepstakePlayerAPI));
  });

  const sortedData = formattedData.sort((a, b) => {
    if (b.players.rating !== a.players.rating) {
      return b.players.rating - a.players.rating;
    }
    return b.score - a.score;
  });

  return sortedData;
}

export function useSweepstakePlayers(sweepstakeId: string) {
  return useQuery({
    queryKey: [TABLE_SWEEPSTAKE_PLAYERS, sweepstakeId],
    queryFn: () => getSweepstakePlayers(sweepstakeId),
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
  });
}
