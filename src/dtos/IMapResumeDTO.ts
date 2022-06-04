interface IMapResumeDTO {
  id?: string;
  mapType: string;
  name: string;
  link?: string;
  selectedDate?: Date;
  startFromTerrorist: number;
  winner: number;
}

export default IMapResumeDTO;
