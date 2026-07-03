import type { PostgrestResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { FUNCTION_GET_RANKING_BY_YEAR } from '~/config/constants';
import type IViewRankingAPI from '~/models/Entity/Ranking/IViewRankingAPI';
import supabase from '~/services/supabase';

export async function getRanking(userId: string, year: number): Promise<IViewRankingAPI[]> {
  const { data, error }: PostgrestResponse<IViewRankingAPI> = await supabase.rpc(FUNCTION_GET_RANKING_BY_YEAR, {
    p_user_id: userId,
    p_year: year,
  });

  if (error) {
    throw error;
  }

  return data || [];
}

export function useRanking(userId: string, year: number) {
  return useQuery({
    queryKey: [FUNCTION_GET_RANKING_BY_YEAR, userId, year],
    queryFn: () => getRanking(userId, year),
    refetchOnWindowFocus: true,
  });
}
