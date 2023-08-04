import ISelectOption from '~/models/ISelectOption';

interface IMap {
  id: string;
  game_type: ISelectOption;
  map_type: ISelectOption;
  name: string;
  active: boolean;
}

export default IMap;
