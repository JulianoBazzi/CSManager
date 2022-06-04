import IPlayerDTO from '@/dtos/IPlayerDTO';

/* eslint-disable camelcase */
interface IRankingDTO {
  id?: string;
  user_id?: string;
  sweepstake_id?: string;
  map_id?: string;
  player_id?: string;
  team: number;
  side: string;
  kill: number;
  assistance: number;
  death: number;
  score: number;
  players: IPlayerDTO;
}

export default IRankingDTO;
