import IMapAPI from '~/models/Entity/Map/IMapAPI';

interface ISweepstakeMapAPI {
  id: string;
  sweepstake_id: string;
  map_id: string;
  team_start_from_terrorist: number;
  team_one_score_1: number;
  team_two_score_1: number;
  team_one_score_2: number;
  team_two_score_2: number;
  maps: IMapAPI;
}

export default ISweepstakeMapAPI;
