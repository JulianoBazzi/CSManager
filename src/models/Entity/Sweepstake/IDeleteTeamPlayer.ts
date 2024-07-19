import { SweepstakeTeamEnum } from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';

interface IDeleteTeamPlayer {
  sweepstake_player_id: string;
  score: number;
  team: SweepstakeTeamEnum;
}

export default IDeleteTeamPlayer;
