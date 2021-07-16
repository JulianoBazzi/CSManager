import IMapDTO from './IMapDTO';
import ITeamDTO from './ITeamDTO';

interface ISweepstakeDTO {
  id?: string;
  userId: string;
  gameType: string;
  considerPatents: boolean;
  considerPreviousRankings: boolean;
  quantityPlayers: number;
  quantityMaps: number;
  created: Date;
  updated: Date;
  teams: ITeamDTO[];
  maps: IMapDTO[];
}

export default ISweepstakeDTO;
