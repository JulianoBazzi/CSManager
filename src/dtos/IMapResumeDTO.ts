import IMatcheDTO from './IMatcheDTO';

interface IMapResumeDTO {
  id?: string;
  mapType: string;
  name: string;
  link?: string;
  selectedDate?: Date;
  matches: IMatcheDTO[];
  winner: number;
}

export default IMapResumeDTO;
