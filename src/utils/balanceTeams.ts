import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';

function balanceTeams(players: IPlayerAPI[]): [IPlayerAPI[], IPlayerAPI[]] {
  // Ordenar os jogadores por classificação
  const sortedPlayers = players.sort((a, b) => a.premier - b.premier);

  // Inicializar as equipes
  const team1: IPlayerAPI[] = [];
  const team2: IPlayerAPI[] = [];

  // Iterar pelos jogadores e distribuí-los entre as equipes
  sortedPlayers.forEach((player, index) => {
    const targetTeam = index % 2 === 0 ? team1 : team2;
    targetTeam.push(player);
  });

  // Verificar se a diferença de jogadores entre as equipes é maior que 1
  while (Math.abs(team1.length - team2.length) > 1) {
    // Mover o jogador com a menor classificação da equipe com mais jogadores para a outra equipe
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
