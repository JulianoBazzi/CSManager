interface ILeetifyGameAPI {
  skillLevel: number;
  dataSource: string;
}

interface ILeetifyProfileAPI {
  games: ILeetifyGameAPI[];
}

export default ILeetifyProfileAPI;
