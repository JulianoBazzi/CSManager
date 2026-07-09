import { safeDivide } from '@julianobazzi/utils';

import type IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';

// Pesos da força combinada: o score do sorteio (dano médio) e a avaliação em
// estrelas contribuem igualmente após normalização min-max dentro do grupo.
const SCORE_WEIGHT = 0.5;
const RATING_WEIGHT = 0.5;

// Até este tamanho a partição ótima é encontrada por busca exaustiva; com os
// dois melhores ancorados em times opostos o pior caso é C(18,9) = 48.620.
const EXACT_SEARCH_LIMIT = 20;

// Evita trocas por ruído de ponto flutuante no hill-climbing.
const MIN_IMPROVEMENT = 1e-12;
const MAX_HILL_CLIMB_ITERATIONS = 1000;

interface IRankedPlayer {
  player: IPlayerScoreAPI;
  rating: number;
  force: number;
}

function normalize(values: number[]): number[] {
  const min = values.reduce((accumulator, value) => Math.min(accumulator, value), Number.POSITIVE_INFINITY);
  const max = values.reduce((accumulator, value) => Math.max(accumulator, value), Number.NEGATIVE_INFINITY);

  return values.map(value => safeDivide(value - min, max - min));
}

function rankPlayersByForce(players: IPlayerScoreAPI[]): IRankedPlayer[] {
  // Jogador sem score válido recebe a média dos scores positivos do grupo:
  // sem dado ele é tratado como força mediana, não como o pior do sorteio.
  const rawScores = players.map(player => (Number.isFinite(player.score) && player.score > 0 ? player.score : null));
  const positiveScores = rawScores.filter((score): score is number => score !== null);
  const averageScore = safeDivide(
    positiveScores.reduce((sum, score) => sum + score, 0),
    positiveScores.length
  );

  const effectiveScores = rawScores.map(score => score ?? averageScore);
  const ratings = players.map(player => (Number.isFinite(player.rating) ? player.rating : 0));

  const normalizedScores = normalize(effectiveScores);
  const normalizedRatings = normalize(ratings);

  return players
    .map((player, index) => ({
      player,
      rating: ratings[index],
      force: SCORE_WEIGHT * normalizedScores[index] + RATING_WEIGHT * normalizedRatings[index],
    }))
    .sort((a, b) => b.force - a.force || b.rating - a.rating || a.player.id.localeCompare(b.player.id));
}

// Busca exaustiva da partição que minimiza a diferença de força entre os
// times, com o melhor jogador fixo no time A e o segundo melhor no time B
// (elimina partições espelhadas e garante os dois melhores separados).
function exactPartition(ranked: IRankedPlayer[]): [IRankedPlayer[], IRankedPlayer[]] {
  const total = ranked.reduce((sum, item) => sum + item.force, 0);
  const forces = ranked.map(item => item.force);
  const playerCount = ranked.length;

  const allowedTeamASizes =
    playerCount % 2 === 0 ? [playerCount / 2] : [(playerCount - 1) / 2, (playerCount + 1) / 2];

  let bestDifference = Number.POSITIVE_INFINITY;
  let bestIndexes: number[] = [];
  const chosenIndexes: number[] = [];

  for (const teamASize of allowedTeamASizes) {
    const neededIndexes = teamASize - 1;

    const search = (start: number, teamASum: number) => {
      if (chosenIndexes.length === neededIndexes) {
        const difference = Math.abs(2 * teamASum - total);
        if (difference < bestDifference) {
          bestDifference = difference;
          bestIndexes = [...chosenIndexes];
        }
        return;
      }

      const remaining = neededIndexes - chosenIndexes.length;
      for (let index = start; index <= playerCount - remaining; index++) {
        chosenIndexes.push(index);
        search(index + 1, teamASum + forces[index]);
        chosenIndexes.pop();
      }
    };

    search(2, forces[0]);
  }

  const teamAIndexes = new Set([0, ...bestIndexes]);
  const teamA: IRankedPlayer[] = [];
  const teamB: IRankedPlayer[] = [];

  ranked.forEach((item, index) => {
    (teamAIndexes.has(index) ? teamA : teamB).push(item);
  });

  return [teamA, teamB];
}

// Para grupos grandes: snake draft (1-2-2-1) seguido de hill-climbing com
// trocas 1<->1 e movimentos para o time menor, sem mover os dois melhores.
function heuristicPartition(ranked: IRankedPlayer[]): [IRankedPlayer[], IRankedPlayer[]] {
  const teamA: IRankedPlayer[] = [];
  const teamB: IRankedPlayer[] = [];

  ranked.forEach((item, index) => {
    const pick = index % 4;
    (pick === 0 || pick === 3 ? teamA : teamB).push(item);
  });

  const sumForces = (team: IRankedPlayer[]) => team.reduce((sum, item) => sum + item.force, 0);

  for (let iteration = 0; iteration < MAX_HILL_CLIMB_ITERATIONS; iteration++) {
    const teamASum = sumForces(teamA);
    const teamBSum = sumForces(teamB);
    const currentDifference = Math.abs(teamASum - teamBSum);

    let bestDifference = currentDifference;
    let bestSwap: [number, number] | null = null;
    let bestMoveIndex: number | null = null;

    for (let indexA = 0; indexA < teamA.length; indexA++) {
      if (teamA[indexA] === ranked[0]) {
        continue;
      }
      for (let indexB = 0; indexB < teamB.length; indexB++) {
        if (teamB[indexB] === ranked[1]) {
          continue;
        }
        const difference = Math.abs(teamASum - teamBSum - 2 * (teamA[indexA].force - teamB[indexB].force));
        if (difference < bestDifference - MIN_IMPROVEMENT) {
          bestDifference = difference;
          bestSwap = [indexA, indexB];
          bestMoveIndex = null;
        }
      }
    }

    if (teamA.length !== teamB.length) {
      const largerIsA = teamA.length > teamB.length;
      const largerTeam = largerIsA ? teamA : teamB;
      const anchor = largerIsA ? ranked[0] : ranked[1];

      for (let index = 0; index < largerTeam.length; index++) {
        if (largerTeam[index] === anchor) {
          continue;
        }
        const delta = largerIsA ? -2 * largerTeam[index].force : 2 * largerTeam[index].force;
        const difference = Math.abs(teamASum - teamBSum + delta);
        if (difference < bestDifference - MIN_IMPROVEMENT) {
          bestDifference = difference;
          bestSwap = null;
          bestMoveIndex = index;
        }
      }
    }

    if (bestSwap) {
      const [indexA, indexB] = bestSwap;
      const movedFromA = teamA[indexA];
      teamA[indexA] = teamB[indexB];
      teamB[indexB] = movedFromA;
    } else if (bestMoveIndex !== null) {
      const largerTeam = teamA.length > teamB.length ? teamA : teamB;
      const smallerTeam = largerTeam === teamA ? teamB : teamA;
      smallerTeam.push(largerTeam.splice(bestMoveIndex, 1)[0]);
    } else {
      break;
    }
  }

  return [teamA, teamB];
}

function balanceTeams(players: IPlayerScoreAPI[]): [IPlayerScoreAPI[], IPlayerScoreAPI[]] {
  if (players.length === 0) {
    return [[], []];
  }

  const ranked = rankPlayersByForce(players);

  if (ranked.length === 1) {
    return [[ranked[0].player], []];
  }

  const [teamA, teamB] =
    ranked.length <= EXACT_SEARCH_LIMIT ? exactPartition(ranked) : heuristicPartition(ranked);

  const byForceDescending = (a: IRankedPlayer, b: IRankedPlayer) => b.force - a.force;

  // O time A contém o jogador mais forte por construção e retorna como team1.
  // Os objetos originais são preservados: o chamador persiste player.score cru.
  return [
    [...teamA].sort(byForceDescending).map(item => item.player),
    [...teamB].sort(byForceDescending).map(item => item.player),
  ];
}

export default balanceTeams;
