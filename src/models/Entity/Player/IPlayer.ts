import ISelectOption from '~/models/ISelectOption';

interface IPlayer {
  id: string;
  name: string;
  username: string;
  patent: ISelectOption;
  active: boolean;
}

export default IPlayer;
