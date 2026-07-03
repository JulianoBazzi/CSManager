import { formatDateTime, getLabelById } from '@julianobazzi/utils';
import { useQuery } from '@tanstack/react-query';
import { games } from '~/assets/games';
import { sweepstakeEngines } from '~/assets/sweepstakeEngines';
import { TABLE_SWEEPSTAKES } from '~/config/constants';
import type ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export function formatSweepstakes(sweepstake: ISweepstakeAPI): ISweepstakeAPI {
  return {
    ...sweepstake,
    format_game_type: getLabelById(games, sweepstake.game_type, 'name', 'Não Localizado'),
    format_short_game_type: getLabelById(games, sweepstake.game_type, 'shortName', 'Não Localizado'),
    format_engine: getLabelById(sweepstakeEngines, sweepstake.engine, 'name', 'Não Localizado'),
    format_departure_at: formatDateTime(sweepstake.departure_at),
  };
}

export async function getSweepstakes(userId: string): Promise<ISweepstakeAPI[]> {
  const { data, error } = await supabase
    .from(TABLE_SWEEPSTAKES)
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(formatSweepstakes);
}

export async function getSweepstake(id: string): Promise<ISweepstakeAPI> {
  const { data, error } = await supabase.from(TABLE_SWEEPSTAKES).select().eq('id', id).limit(1).single();

  if (error) {
    throw error;
  }

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
