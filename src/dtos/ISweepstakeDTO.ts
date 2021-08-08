import IMapResumeDTO from './IMapResumeDTO';
import ITeamDTO from './ITeamDTO';

interface ISweepstakeDTO {
  id?: string;
  userId: string;
  gameType: string;
  considerPatents: boolean;
  considerPreviousRankings: boolean;
  quantityPlayers: number;
  quantityMaps: number;
  teams: ITeamDTO[];
  maps: IMapResumeDTO[];
  departure: Date;
  created: Date;
  updated: Date;
}

export default ISweepstakeDTO;
