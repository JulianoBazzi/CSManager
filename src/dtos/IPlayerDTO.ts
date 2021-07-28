interface IPlayerDTO {
  id?: string;
  name: string;
  username: string;
  patent: string;
  active: boolean;
  created?: Date;
  selectedDate?: Date;
}

export default IPlayerDTO;
