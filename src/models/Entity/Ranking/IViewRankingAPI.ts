import IEntityBase from '~/models/Entity/Base/IEntityBase';

interface IViewRankingAPI extends IEntityBase {
  user_id: string;
  name: string;
  username: string;
  premier: number;
  star: number;
  sweepstake_count: number;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;
}

export default IViewRankingAPI;
