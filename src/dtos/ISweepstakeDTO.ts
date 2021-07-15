interface ISweepstakeDTO {
  id?: string;
  gameType: string;
  considerPatents: boolean;
  considerPreviousRankings: boolean;
  quantityPlayers: number;
  quantityMaps: number;
  created?: Date;
}

export default ISweepstakeDTO;
