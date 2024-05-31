import IEntityBase from '~/models/Entity/Base/IEntityBase';

interface IViewMapRankingAPI extends IEntityBase {
  user_id: string;
  map_id: string;
  player_id: string;
  name: string;
  map_type: string;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;
}

export default IViewMapRankingAPI;
