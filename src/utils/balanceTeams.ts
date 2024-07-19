import IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';

function balanceTeams(players: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
  function calculateScoreDifference(team1: IPlayerScoreAPI[], team2: IPlayerScoreAPI[]): number {
    const score1 = team1.reduce((sum, player) => sum + player.score, 0);
    const score2 = team2.reduce((sum, player) => sum + player.score, 0);
    return Math.abs(score1 - score2);
  }

  function calculateTeamScore(team: IPlayerScoreAPI[]): number {
    return team.reduce((sum, player) => sum + player.score, 0);
  }

  function generateTeams(playerList: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
    const playersByStart: { [key: number]: IPlayerScoreAPI[] } = {};
    for (let i = 0; i <= 5; i += 1) {
      playersByStart[i] = [];
    }
    playerList.forEach((player) => {
      playersByStart[player.star].push(player);
    });

    const team1: IPlayerScoreAPI[] = [];
    const team2: IPlayerScoreAPI[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const currentPlayers = playersByStart[i];
      currentPlayers.sort((a, b) => b.score - a.score);

      currentPlayers.forEach((player, index) => {
        const targetTeam = index % 2 === 0 ? team1 : team2;
        targetTeam.push(player);
      });
    }

    while (Math.abs(team1.length - team2.length) > 1) {
      const sourceTeam = team1.length > team2.length ? team1 : team2;
      const targetTeam = team1.length < team2.length ? team1 : team2;

      const worstPlayerIndex = sourceTeam.reduce((worstIdx, player, idx, arr) => {
        const worstPlayer = arr[worstIdx];
        if (player.star < worstPlayer.star || (player.star === worstPlayer.star && player.score < worstPlayer.score)) {
          return idx;
        }
        return worstIdx;
      }, 0);

      const playerToMove = sourceTeam.splice(worstPlayerIndex, 1)[0];
      if (playerToMove) {
        targetTeam.push(playerToMove);
      }
    }

    if (team1.length !== team2.length) {
      const score1 = calculateTeamScore(team1);
      const score2 = calculateTeamScore(team2);

      const sourceTeam = score1 > score2 ? team1 : team2;
      const targetTeam = score1 > score2 ? team2 : team1;

      const worstPlayerIndex = sourceTeam.reduce((worstIdx, player, idx, arr) => {
        const worstPlayer = arr[worstIdx];
        if (player.star < worstPlayer.star || (player.star === worstPlayer.star && player.score < worstPlayer.score)) {
          return idx;
        }
        return worstIdx;
      }, 0);

      const playerToMove = sourceTeam.splice(worstPlayerIndex, 1)[0];
      if (playerToMove) {
        targetTeam.push(playerToMove);
      }
    }

    return [team1, team2];
  }

  let bestTeams: [IPlayerScoreAPI[], IPlayerScoreAPI[]] = [[], []];
  let smallestDifference = Infinity;

  for (let i = 0; i < 10; i += 1) {
    const [team1, team2] = generateTeams(players);
    const difference = calculateScoreDifference(team1, team2);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestTeams = [team1, team2];
    }
  }

  return bestTeams;
}

export default balanceTeams;
