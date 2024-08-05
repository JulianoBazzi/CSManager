import { QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { VIEW_MAP_RANKING } from '~/config/constants';
import IViewMapRankingAPI from '~/models/Entity/Ranking/IViewMapRankingAPI';
import supabase from '~/services/supabase';

export async function getPlayerMapRanking(playerId: string): Promise<IViewMapRankingAPI[]> {
  const { data } = await supabase
    .from(VIEW_MAP_RANKING)
    .select()
    .order('damage', { ascending: false })
    .eq('player_id', playerId);

  return data as unknown as IViewMapRankingAPI[];
}

export function usePlayerMapRanking(playerId: string, options?: Omit<QueryObserverOptions<IViewMapRankingAPI[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [VIEW_MAP_RANKING, playerId],
    queryFn: () => getPlayerMapRanking(playerId),
    refetchOnWindowFocus: true,
    ...options,
  });
}
