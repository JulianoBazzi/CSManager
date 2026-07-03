import { useQuery } from '@tanstack/react-query';

import { VIEW_SWEEPSTAKE_RANKING } from '~/config/constants';
import type IViewSeepstakeRankingAPI from '~/models/Entity/Ranking/IViewSeepstakeRankingAPI';
import supabase from '~/services/supabase';

export async function getSweepstakeRanking(sweepstakeId: string): Promise<IViewSeepstakeRankingAPI[]> {
  const { data, error } = await supabase
    .from(VIEW_SWEEPSTAKE_RANKING)
    .select()
    .order('damage', { ascending: false })
    .eq('sweepstake_id', sweepstakeId);

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as IViewSeepstakeRankingAPI[];
}

export function useSweepstakeRanking(sweepstakeId: string) {
  return useQuery({
    queryKey: [VIEW_SWEEPSTAKE_RANKING, sweepstakeId],
    queryFn: () => getSweepstakeRanking(sweepstakeId),
    refetchOnWindowFocus: true,
  });
}
