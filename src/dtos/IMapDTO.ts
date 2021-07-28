interface IMapDTO {
  id?: string;
  gameType: string;
  mapType: string;
  name: string;
  link?: string;
  active: boolean;
  created?: Date;
  selectedDate?: Date;
}

export default IMapDTO;
