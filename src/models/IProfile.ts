import ISelectOption from '~/models/ISelectOption';

interface IProfile {
  name: string;
  game_type: ISelectOption;
  engine: ISelectOption;
}

export default IProfile;
