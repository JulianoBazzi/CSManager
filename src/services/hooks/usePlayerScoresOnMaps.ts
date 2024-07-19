import { PostgrestResponse } from '@supabase/supabase-js';

import IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';
import supabase from '~/services/supabase';

export async function getPlayersScoresOnMaps(playerIds: string[], mapsIds: string[], userId: string): Promise<IPlayerScoreAPI[] | null> {
  const { data }: PostgrestResponse<IPlayerScoreAPI> = await supabase.rpc('get_player_scores_on_maps', {
    map_ids: mapsIds,
    player_ids: playerIds,
    user_id: userId,
  });

  return data;
}

export async function getPlayerScoresOnMaps(playerId: string, mapsIds: string[], userId: string): Promise<IPlayerScoreAPI | null> {
  const { data }: PostgrestResponse<IPlayerScoreAPI> = await supabase.rpc('get_player_scores_on_maps', {
    map_ids: mapsIds,
    player_ids: [playerId],
    user_id: userId,
  });

  return data && data.length > 0 ? data[0] : null;
}
