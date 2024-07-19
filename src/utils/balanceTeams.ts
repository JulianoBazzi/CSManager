import IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';

function balanceTeams(players: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
  function calculateScoreDifference(team1: IPlayerScoreAPI[], team2: IPlayerScoreAPI[]): number {
    const score1 = team1.reduce((sum, player) => sum + player.score, 0);
    const score2 = team2.reduce((sum, player) => sum + player.score, 0);
    return Math.abs(score1 - score2);
  }

  function generateTeams(playerList: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
    const shuffledPlayers = [...playerList].sort(() => Math.random() - 0.5);

    const team1: IPlayerScoreAPI[] = [];
    const team2: IPlayerScoreAPI[] = [];

    shuffledPlayers.forEach((player, index) => {
      const targetTeam = index % 2 === 0 ? team1 : team2;
      targetTeam.push(player);
    });

    while (Math.abs(team1.length - team2.length) > 1) {
      const sourceTeam = team1.length > team2.length ? team1 : team2;
      const targetTeam = team1.length < team2.length ? team1 : team2;

      const playerToMove = sourceTeam.shift();
      if (playerToMove) {
        targetTeam.push(playerToMove);
      }
    }

    return [team1, team2];
  }

  let bestTeams: [IPlayerScoreAPI[], IPlayerScoreAPI[]] = [[], []];
  let smallestDifference = Infinity;

  for (let i = 0; i < 10;) {
    const [team1, team2] = generateTeams(players);
    const difference = calculateScoreDifference(team1, team2);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestTeams = [team1, team2];
    }

    i += 1;
  }

  return bestTeams;
}

export default balanceTeams;
