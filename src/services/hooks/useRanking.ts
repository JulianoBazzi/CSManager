import { useQuery } from '@tanstack/react-query';

import { VIEW_RANKING } from '~/config/constants';
import IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import supabase from '~/services/supabase';

export async function getRanking(userId: string): Promise<IViewRankingAPI[]> {
  const { data } = await supabase
    .from(VIEW_RANKING)
    .select()
    .order('damage', { ascending: false })
    .eq('user_id', userId);

  return data as unknown as IViewRankingAPI[];
}

export function useRanking(userId: string) {
  return useQuery({
    queryKey: [VIEW_RANKING, userId],
    queryFn: () => getRanking(userId),
    refetchOnWindowFocus: true,
  });
}
