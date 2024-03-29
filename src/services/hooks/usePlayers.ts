import { useQuery } from '@tanstack/react-query';

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

export async function getPlayers(userId: string, onlyActives?: boolean): Promise<IPlayerAPI[]> {
  const { data } = await supabase.from(TABLE_PLAYERS).select().eq('user_id', userId).in('active', onlyActives ? [true] : [true, false])
    .order('name', { ascending: true });

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

export function usePlayers(userId: string, onlyActives?: boolean) {
  return useQuery({
    queryKey: [TABLE_PLAYERS, userId, onlyActives],
    queryFn: () => getPlayers(userId, onlyActives),
  });
}

export async function fetchPlayers(userId: string) {
  return queryClient.fetchQuery({
    queryKey: [TABLE_PLAYERS, userId],
    queryFn: () => getPlayers(userId),
  });
}
