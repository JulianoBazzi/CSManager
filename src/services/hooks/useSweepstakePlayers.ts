import { useQuery, QueryOptions } from 'react-query';

import { TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import ISweepstakePlayerAPI from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';
import supabase from '~/services/supabase';

export async function getSweepstakePlayers(sweepstakeId: string): Promise<ISweepstakePlayerAPI[]> {
  const { data } = await supabase
    .from(TABLE_SWEEPSTAKE_PLAYERS)
    .select('id, sweepstake_id, team, players(name, username, patent)')
    .order('id', { ascending: true })
    .eq('sweepstake_id', sweepstakeId);

  return data as ISweepstakePlayerAPI[];
}

export function useSweepstakePlayers(sweepstakeId: string, options?: QueryOptions<ISweepstakePlayerAPI[]>) {
  return useQuery([TABLE_SWEEPSTAKE_PLAYERS, sweepstakeId], () => getSweepstakePlayers(sweepstakeId), {
    keepPreviousData: true,
    ...options,
  });
}
