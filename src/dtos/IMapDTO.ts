interface IMapDTO {
  selected?: boolean;
  id?: string;
  gameType: string;
  mapType: string;
  name: string;
  link?: string;
  active: boolean;
  created?: Date;
}

export default IMapDTO;
