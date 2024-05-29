interface IRanking {
  user_id: string;
  sweepstake_id: string;
  map_id: string;
  player_id: string;
  kills: number;
  deaths: number;
  assistances: number;
  headshot_percentage: number;
  damage: number;
}

export default IRanking;
