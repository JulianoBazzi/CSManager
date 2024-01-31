import { useQuery } from '@tanstack/react-query';

import { games } from '~/assets/games';
import { maps } from '~/assets/maps';
import { TABLE_MAPS } from '~/config/constants';
import IMapAPI from '~/models/Entity/Map/IMapAPI';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import { formatBoolean } from '~/utils/formatBoolean';

export function formatMap(map: IMapAPI): IMapAPI {
  return {
    ...map,
    format_short_game_type: games.find((patent) => patent.id === map.game_type)?.shortName ?? 'Não Localizado',
    format_map_type: maps.find((patent) => patent.id === map.map_type)?.name ?? 'Não Localizado',
    format_active: formatBoolean(map.active),
  };
}

export async function getMaps(userId: string, onlyActives?: boolean): Promise<IMapAPI[]> {
  const { data } = await supabase.from(TABLE_MAPS).select().eq('user_id', userId).in('active', onlyActives ? [true] : [true, false])
    .order('name', { ascending: true });

  const formattedData: IMapAPI[] = [];

  data?.forEach((player) => {
    formattedData.push(formatMap(player));
  });

  return formattedData;
}

export async function getMap(id: string, userId: string): Promise<IMapAPI> {
  const { data } = await supabase.from(TABLE_MAPS).select().eq('user_id', userId).eq('id', id)
    .limit(1)
    .single();

  return formatMap(data);
}

export function useMaps(userId: string, onlyActives?: boolean) {
  return useQuery({
    queryKey: [TABLE_MAPS, userId, onlyActives],
    queryFn: () => getMaps(userId, onlyActives),
  });
}

export async function fetchMaps(userId: string) {
  return queryClient.fetchQuery({
    queryKey: [TABLE_MAPS, userId],
    queryFn: () => getMaps(userId),
  });
}
