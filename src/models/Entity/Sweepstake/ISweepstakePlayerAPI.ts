import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';

export enum SweepstakeTeamEnum {
  One = 0,
  Two = 1,
}

interface ISweepstakePlayerAPI {
  id: string;
  sweepstake_id: string;
  team: SweepstakeTeamEnum;
  score: number;
  players: IPlayerAPI;
}

export default ISweepstakePlayerAPI;
