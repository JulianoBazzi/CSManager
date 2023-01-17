import { useQuery, QueryOptions } from 'react-query';

import { TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import ISweepstakePlayerAPI from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';
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
    .select('id, sweepstake_id, team, players(name, username, patent)')
    .order('id', { ascending: true })
    .eq('sweepstake_id', sweepstakeId);

  const formattedData: ISweepstakePlayerAPI[] = [];

  data?.forEach((sweepstakePlayer) => {
    formattedData.push(formatSweepstakePlayer(sweepstakePlayer as ISweepstakePlayerAPI));
  });

  return formattedData;
}

export function useSweepstakePlayers(sweepstakeId: string, options?: QueryOptions<ISweepstakePlayerAPI[]>) {
  return useQuery([TABLE_SWEEPSTAKE_PLAYERS, sweepstakeId], () => getSweepstakePlayers(sweepstakeId), {
    keepPreviousData: true,
    ...options,
  });
}
