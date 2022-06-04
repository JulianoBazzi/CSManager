import IMapDTO from '@/dtos/IMapDTO';

/* eslint-disable camelcase */
interface ISweepstakeMapDTO {
  id?: string;
  user_id: string;
  map_id: string;
  team_start_from_terrorist: number;
  team_one_score_1: number;
  team_one_score_2: number;
  team_two_score_1: number;
  team_two_score_2: number;
  team_winner: number;
  map: IMapDTO;
}

export default ISweepstakeMapDTO;
