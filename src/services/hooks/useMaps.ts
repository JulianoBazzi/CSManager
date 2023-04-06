import { useQuery, QueryOptions } from '@tanstack/react-query';

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

export async function getMaps(userId: string): Promise<IMapAPI[]> {
  const { data } = await supabase.from(TABLE_MAPS).select().eq('user_id', userId).order('name', { ascending: true });

  const formattedData: IMapAPI[] = [];

  data?.forEach((player) => {
    formattedData.push(formatMap(player));
  });

  return formattedData;
}

export async function getMap(id: string, userId: string): Promise<IMapAPI> {
  const { data } = await supabase.from(TABLE_MAPS).select().eq('user_id', userId).eq('id', id).limit(1).single();

  return formatMap(data);
}

export function useMaps(userId: string, options?: QueryOptions<IMapAPI[]>) {
  return useQuery([TABLE_MAPS, userId], () => getMaps(userId), {
    keepPreviousData: true,
    ...options,
  });
}

export async function fetchMaps(userId: string) {
  return queryClient.fetchQuery([TABLE_MAPS, userId], () => getMaps(userId));
}
