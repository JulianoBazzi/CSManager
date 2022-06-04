import IPlayerDTO from '@/dtos/IPlayerDTO';

/* eslint-disable camelcase */
interface ISweepstakePlayerDTO {
  id?: string;
  user_id?: string;
  sweepstake_id?: string;
  player_id?: string;
  team: number;
  player?: IPlayerDTO;
}

export default ISweepstakePlayerDTO;
