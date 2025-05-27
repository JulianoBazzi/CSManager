import type IEntityBase from '~/models/Entity/Base/IEntityBase';
import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';

export interface IPlayerLeaderboardAPI extends IEntityBase {
  player?: IPlayerAPI;
  name: string;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;
}

export default IPlayerLeaderboardAPI;
