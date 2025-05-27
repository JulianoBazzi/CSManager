import type IMapAPI from '~/models/Entity/Map/IMapAPI';
import type { SweepstakeTeamEnum } from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';

interface ISweepstakeMapAPI {
  id: string;
  user_id: string;
  sweepstake_id: string;
  map_id: string;
  team_start_from_terrorist: SweepstakeTeamEnum;
  team_one_score_1: number;
  team_two_score_1: number;
  team_one_score_2: number;
  team_two_score_2: number;
  maps: IMapAPI;
}

export default ISweepstakeMapAPI;
