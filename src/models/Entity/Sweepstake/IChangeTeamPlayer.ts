import { SweepstakeTeamEnum } from '~/models/Entity/Sweepstake/ISweepstakePlayerAPI';

interface IChangeTeamPlayer {
  sweepstake_player_id: string;
  score: number;
  team: SweepstakeTeamEnum;
}

export default IChangeTeamPlayer;
