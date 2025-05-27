import type IEntityBase from '~/models/Entity/Base/IEntityBase';

interface IViewSeepstakeRankingAPI extends IEntityBase {
  user_id: string;
  sweepstake_id: string;
  player_id: string;
  name: string;
  username: string;
  premier: number;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;
}

export default IViewSeepstakeRankingAPI;
