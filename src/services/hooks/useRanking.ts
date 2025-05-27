import type { PostgrestResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { FUNCTION_GET_RANKING_BY_YEAR } from '~/config/constants';
import type IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import supabase from '~/services/supabase';

export async function getRanking(userId: string, year: number): Promise<IViewRankingAPI[]> {
  const { data }: PostgrestResponse<IViewRankingAPI> = await supabase.rpc(FUNCTION_GET_RANKING_BY_YEAR, {
    p_user_id: userId,
    p_year: year,
  });

  // const { data } = await supabase
  //   .from(FUNCTION_GET_RANKING_BY_YEAR)
  //   .select()
  //   .order('damage', { ascending: false })
  //   .eq('user_id', userId);

  return data || [];
}

export function useRanking(userId: string, year: number) {
  return useQuery({
    queryKey: [FUNCTION_GET_RANKING_BY_YEAR, userId, year],
    queryFn: () => getRanking(userId, year),
    refetchOnWindowFocus: true,
  });
}
