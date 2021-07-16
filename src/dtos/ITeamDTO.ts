import IPlayerDTO from './IPlayerDTO';

interface ITeamDTO {
  description: string;
  quantityPlayers: number;
  players: IPlayerDTO[];
}

export default ITeamDTO;
