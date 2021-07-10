// eslint-disable-next-line no-shadow
interface IMapDTO {
  id?: string;
  gameType: string;
  mapType: string;
  name: string;
  link?: string;
  active: boolean;
  created?: Date;
}

export default IMapDTO;
