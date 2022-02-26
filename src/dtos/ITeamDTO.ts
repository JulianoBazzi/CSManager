import IPlayerResumeDTO from './IPlayerResumeDTO';

interface ITeamDTO {
  description: string;
  quantityPlayers: number;
  players: IPlayerResumeDTO[];
}

export default ITeamDTO;
