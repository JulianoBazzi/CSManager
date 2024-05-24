interface IPlayerAPI {
  id: string;
  name: string;
  username: string;
  steam_id: string;
  premier: number;
  active: boolean;
  fetch_data: boolean;

  format_active: string;
}

export default IPlayerAPI;
