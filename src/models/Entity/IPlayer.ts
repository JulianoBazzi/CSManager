interface IPlayer {
  id: string;
  name: string;
  username: string;
  patent: string;
  active: boolean;

  format_patent?: string;
  format_active?: string;
}

export default IPlayer;
