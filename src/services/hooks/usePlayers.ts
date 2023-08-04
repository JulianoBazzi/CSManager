import { useQuery, QueryOptions } from '@tanstack/react-query';

import { patents } from '~/assets/patents';
import { TABLE_PLAYERS } from '~/config/constants';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import { formatBoolean } from '~/utils/formatBoolean';

export function formatPlayer(player: IPlayerAPI): IPlayerAPI {
  return {
    ...player,
    format_patent: patents.find((patent) => patent.id === player.patent)?.name ?? 'Não Localizado',
    format_active: formatBoolean(player.active),
  };
}

export async function getPlayers(userId: string): Promise<IPlayerAPI[]> {
  const { data } = await supabase.from(TABLE_PLAYERS).select().eq('user_id', userId).order('name', { ascending: true });

  const formattedData: IPlayerAPI[] = [];

  data?.forEach((player) => {
    formattedData.push(formatPlayer(player));
  });

  return formattedData;
}

export async function getPlayer(id: string, userId: string): Promise<IPlayerAPI> {
  const { data } = await supabase.from(TABLE_PLAYERS).select().eq('user_id', userId).eq('id', id)
    .limit(1)
    .single();

  return formatPlayer(data);
}

export function usePlayers(userId: string, options?: QueryOptions<IPlayerAPI[]>) {
  return useQuery([TABLE_PLAYERS, userId], () => getPlayers(userId), {
    keepPreviousData: true,
    ...options,
  });
}

export async function fetchPlayers(userId: string) {
  return queryClient.fetchQuery([TABLE_PLAYERS, userId], () => getPlayers(userId));
}
