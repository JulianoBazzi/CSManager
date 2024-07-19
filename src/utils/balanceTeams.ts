import IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';

function balanceTeams(players: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
  const sortedPlayers = players.sort((a, b) => a.score - b.score);

  const team1: IPlayerScoreAPI[] = [];
  const team2: IPlayerScoreAPI[] = [];

  sortedPlayers.forEach((player, index) => {
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

export default balanceTeams;
