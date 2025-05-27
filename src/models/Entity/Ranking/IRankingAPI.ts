import type IEntityBase from '~/models/Entity/Base/IEntityBase';
import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';

interface IRankingAPI extends IEntityBase {
  user_id: string;
  sweepstake_id: string;
  map_id: string;
  player_id: string;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;

  players: IPlayerAPI;

  format_player_name: string;
  format_player_username: string;
}

export default IRankingAPI;
