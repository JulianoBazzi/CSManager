import type IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';

function balanceTeams(players: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
  function calculateTeamScore(team: IPlayerScoreAPI[]): number {
    return team.reduce((sum, player) => sum + player.score, 0);
  }

  function generateTeams(playerList: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
    const team1: IPlayerScoreAPI[] = [];
    const team2: IPlayerScoreAPI[] = [];

    const sortedPlayerList = playerList.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.score - a.score;
    });

    sortedPlayerList.forEach((player, index) => {
      const targetTeam = index % 2 === 0 ? team1 : team2;
      targetTeam.push(player);
    });

    while (Math.abs(team1.length - team2.length) > 1) {
      const sourceTeam = team1.length > team2.length ? team1 : team2;
      const targetTeam = team1.length < team2.length ? team1 : team2;

      const worstPlayerIndex = sourceTeam.reduce((worstIdx, player, idx, arr) => {
        const worstPlayer = arr[worstIdx];
        if (player.rating < worstPlayer.rating || (player.rating === worstPlayer.rating && player.score < worstPlayer.score)) {
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
        if (player.rating < worstPlayer.rating || (player.rating === worstPlayer.rating && player.score < worstPlayer.score)) {
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

  return generateTeams(players);
}

export default balanceTeams;
