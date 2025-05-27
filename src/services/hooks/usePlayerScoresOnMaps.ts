import type { PostgrestResponse } from '@supabase/supabase-js';

import { FUNCTION_GET_PLAYER_SCORES_ON_MAPS } from '~/config/constants';
import type IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';
import supabase from '~/services/supabase';

export async function getPlayersScoresOnMaps(playerIds: string[], mapsIds: string[], userId: string): Promise<IPlayerScoreAPI[] | null> {
  const { data }: PostgrestResponse<IPlayerScoreAPI> = await supabase.rpc(FUNCTION_GET_PLAYER_SCORES_ON_MAPS, {
    map_ids: mapsIds,
    player_ids: playerIds,
    user_id: userId,
  });

  return data;
}

export async function getPlayerScoresOnMaps(playerId: string, mapsIds: string[], userId: string): Promise<IPlayerScoreAPI | null> {
  const { data }: PostgrestResponse<IPlayerScoreAPI> = await supabase.rpc(FUNCTION_GET_PLAYER_SCORES_ON_MAPS, {
    map_ids: mapsIds,
    player_ids: [playerId],
    user_id: userId,
  });

  return data && data.length > 0 ? data[0] : null;
}
