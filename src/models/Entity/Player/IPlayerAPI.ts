import IEntityBase from '~/models/Entity/Base/IEntityBase';

interface IPlayerAPI extends IEntityBase {
  name: string;
  username: string;
  steam_id: string;
  premier: number;
  rating: number;
  active: boolean;
  fetch_data: boolean;

  format_active: string;
}

export default IPlayerAPI;
