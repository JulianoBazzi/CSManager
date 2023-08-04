import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';

interface ISweepstakePlayerAPI {
  id: string;
  sweepstake_id: string;
  team: number;
  players: IPlayerAPI;
}

export default ISweepstakePlayerAPI;
