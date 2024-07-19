import { SweepstakeTeamEnum } from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';

interface ISweepstakePlayer {
  user_id: string;
  sweepstake_id: string;
  player_id: string;
  team: SweepstakeTeamEnum;
  score: number;
}

export default ISweepstakePlayer;
