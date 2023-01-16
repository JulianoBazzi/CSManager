import { useQuery, QueryOptions } from 'react-query';

import { games } from '~/assets/games';
import { TABLE_SWEEPSTAKES } from '~/config/constants';
import ISweepstakeAPI from '~/models/Entity/ISweepstakeAPI';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import { formatDatetime } from '~/utils/formatDatetime';

export function formatSweepstakes(sweepstake: ISweepstakeAPI): ISweepstakeAPI {
  return {
    ...sweepstake,
    format_game_type: games.find((game) => game.id === sweepstake.game_type)?.name ?? 'Não Localizado',
    format_short_game_type: games.find((game) => game.id === sweepstake.game_type)?.shortName ?? 'Não Localizado',
    format_departure_at: formatDatetime(sweepstake.departure_at),
  };
}

export async function getSweepstakes(userId: string): Promise<ISweepstakeAPI[]> {
  const { data } = await supabase
    .from(TABLE_SWEEPSTAKES)
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const formattedData: ISweepstakeAPI[] = [];

  data?.forEach((sweepstake) => {
    formattedData.push(formatSweepstakes(sweepstake));
  });

  return formattedData;
}

export async function getSweepstake(id: string): Promise<ISweepstakeAPI> {
  const { data } = await supabase.from(TABLE_SWEEPSTAKES).select().eq('id', id).limit(1).single();

  return formatSweepstakes(data);
}

export function useSweepstakes(userId: string, options?: QueryOptions<ISweepstakeAPI[]>) {
  return useQuery([TABLE_SWEEPSTAKES, userId], () => getSweepstakes(userId), {
    keepPreviousData: true,
    ...options,
  });
}

export async function fetchSweepstakes(userId: string) {
  return queryClient.fetchQuery([TABLE_SWEEPSTAKES, userId], () => getSweepstakes(userId));
}
