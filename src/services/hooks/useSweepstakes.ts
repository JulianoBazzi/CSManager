import { useQuery } from '@tanstack/react-query';

import { games } from '~/assets/games';
import { sweepstakeEngines } from '~/assets/sweepstakeEngines';
import { TABLE_SWEEPSTAKES } from '~/config/constants';
import ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import { formatDatetime } from '~/utils/formatDatetime';

export function formatSweepstakes(sweepstake: ISweepstakeAPI): ISweepstakeAPI {
  return {
    ...sweepstake,
    format_game_type: games.find((game) => game.id === sweepstake.game_type)?.name ?? 'Não Localizado',
    format_short_game_type: games.find((game) => game.id === sweepstake.game_type)?.shortName ?? 'Não Localizado',
    format_engine: sweepstakeEngines.find((engine) => engine.id === sweepstake.engine)?.name ?? 'Não Localizado',
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
  const { data } = await supabase.from(TABLE_SWEEPSTAKES).select().eq('id', id).limit(1)
    .single();

  return formatSweepstakes(data);
}

export function useSweepstakes(userId: string) {
  return useQuery({
    queryKey: [TABLE_SWEEPSTAKES, userId],
    queryFn: () => getSweepstakes(userId),
  });
}

export async function fetchSweepstakes(userId: string) {
  return queryClient.fetchQuery({
    queryKey: [TABLE_SWEEPSTAKES, userId],
    queryFn: () => getSweepstakes(userId),
  });
}
