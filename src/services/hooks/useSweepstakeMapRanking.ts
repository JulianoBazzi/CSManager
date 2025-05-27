import { useQuery } from '@tanstack/react-query';

import { TABLE_RANKING } from '~/config/constants';
import type IRankingAPI from '~/models/Entity/Ranking/IRankingAPI';
import type IRankingParamsRequest from '~/models/Request/IRankingParamsRequest';
import supabase from '~/services/supabase';

export function formatSweepstakeMapRanking(ranking: IRankingAPI): IRankingAPI {
  return {
    ...ranking,
    format_player_name: ranking.players?.name ?? '-',
    format_player_username: ranking.players?.username ?? '-',
  };
}

export async function getSweepstakeMapRanking(params: IRankingParamsRequest): Promise<IRankingAPI[]> {
  const { data } = await supabase
    .from(TABLE_RANKING)
    .select(`
      id,
      kills,
      deaths,
      assistances,
      headshot_percentage,
      damage,
      players(id, name, username, premier)
      `)
    .order('damage', { ascending: false })
    .eq('sweepstake_id', params.sweepstakeId)
    .eq('map_id', params.mapId);

  const formattedData: IRankingAPI[] = [];

  data?.forEach((ranking) => {
    formattedData.push(formatSweepstakeMapRanking(ranking as unknown as IRankingAPI));
  });

  return formattedData;
}

export function useSweepstakeMapRanking(params: IRankingParamsRequest) {
  return useQuery({
    queryKey: [TABLE_RANKING, params],
    queryFn: () => getSweepstakeMapRanking(params),
    refetchOnWindowFocus: true,
  });
}
