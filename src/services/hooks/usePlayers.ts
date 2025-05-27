import { useQuery } from '@tanstack/react-query';

import { TABLE_PLAYERS } from '~/config/constants';
import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import type IParamsRequest from '~/models/Request/IParamsRequest';
import { getSweepstakePlayers } from '~/services/hooks/useSweepstakePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import { formatBoolean } from '~/utils/formatBoolean';

export function formatPlayer(player: IPlayerAPI): IPlayerAPI {
  return {
    ...player,
    format_active: formatBoolean(player.active),
  };
}

export async function getPlayers(userId: string, params?: IParamsRequest): Promise<IPlayerAPI[]> {
  let query = supabase
    .from(TABLE_PLAYERS)
    .select()
    .eq('user_id', userId);

  if (params?.active) {
    query = query.eq('active', true);
  }

  let sweepstakePlayers: string[] = [];
  if (params?.sweepstakeId) {
    const players = await getSweepstakePlayers(params?.sweepstakeId);
    sweepstakePlayers = players.map((sweepstakePlayer) => sweepstakePlayer.players.id);
  }

  if (params?.sweepstakeIdNot) {
    const players = await getSweepstakePlayers(params?.sweepstakeIdNot);
    sweepstakePlayers = players.map((sweepstakePlayer) => sweepstakePlayer.players.id);
  }

  query = query.order('name', { ascending: true });

  const { data } = await query;

  const formattedData: IPlayerAPI[] = [];

  if (data) {
    for (let i = 0; i < data.length; i++) {
      const player = data[i];
      formattedData.push(formatPlayer(player));
    }
  }

  if (params?.sweepstakeId) {
    return formattedData.filter((player) => sweepstakePlayers.includes(player.id));
  }

  if (params?.sweepstakeIdNot) {
    return formattedData.filter((player) => !sweepstakePlayers.includes(player.id));
  }

  return formattedData;
}

export async function getPlayer(id: string, userId: string): Promise<IPlayerAPI> {
  const { data } = await supabase.from(TABLE_PLAYERS).select().eq('user_id', userId).eq('id', id)
    .limit(1)
    .single();

  return formatPlayer(data);
}

export function usePlayers(userId: string, params?: IParamsRequest) {
  return useQuery({
    queryKey: [TABLE_PLAYERS, userId, params],
    queryFn: () => getPlayers(userId, params),
  });
}

export async function fetchPlayers(userId: string) {
  return queryClient.fetchQuery({
    queryKey: [TABLE_PLAYERS, userId],
    queryFn: () => getPlayers(userId),
  });
}
