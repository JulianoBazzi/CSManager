import { useQuery, QueryOptions } from 'react-query';

import { TABLE_SWEEPSTAKE_MAPS } from '~/config/constants';
import ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import supabase from '~/services/supabase';

export async function getSweepstakeMaps(sweepstakeId: string): Promise<ISweepstakeMapAPI[]> {
  const { data } = await supabase
    .from(TABLE_SWEEPSTAKE_MAPS)
    .select(
      'id, team_start_from_terrorist, team_one_score_1, team_two_score_1, team_one_score_2, team_two_score_2,  maps(map_type, name, link)'
    )
    .order('selected_at', { ascending: true })
    .eq('sweepstake_id', sweepstakeId);

  return data as ISweepstakeMapAPI[];
}

export async function getSweepstakeMap(id: string): Promise<ISweepstakeMapAPI> {
  const { data } = await supabase.from(TABLE_SWEEPSTAKE_MAPS).select().eq('id', id).limit(1).single();

  return data;
}

export function useSweepstakeMaps(sweepstakeId: string, options?: QueryOptions<ISweepstakeMapAPI[]>) {
  return useQuery([TABLE_SWEEPSTAKE_MAPS, sweepstakeId], () => getSweepstakeMaps(sweepstakeId), {
    keepPreviousData: true,
    ...options,
  });
}
