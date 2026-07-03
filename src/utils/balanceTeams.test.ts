import { describe, expect, it } from 'vitest';

import type IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';
import balanceTeams from '~/utils/balanceTeams';

const player = (id: string, rating: number, score: number): IPlayerScoreAPI => ({ id, rating, score });

const allIds = (teams: [IPlayerScoreAPI[], IPlayerScoreAPI[]]) =>
  [...teams[0], ...teams[1]].map(p => p.id).sort();

describe('balanceTeams', () => {
  it('distribui todos os jogadores sem perder nem duplicar', () => {
    const players = [
      player('a', 5, 100),
      player('b', 4, 90),
      player('c', 3, 80),
      player('d', 2, 70),
      player('e', 1, 60),
    ];

    const teams = balanceTeams([...players]);

    expect(allIds(teams)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('mantém a diferença de tamanho entre as equipes em no máximo um', () => {
    const players = Array.from({ length: 7 }, (_, i) => player(`p${i}`, (i % 5) + 1, i * 10));

    const [team1, team2] = balanceTeams(players);

    expect(Math.abs(team1.length - team2.length)).toBeLessThanOrEqual(1);
  });

  it('separa os dois melhores jogadores em equipes diferentes', () => {
    const players = [
      player('best', 5, 100),
      player('second', 5, 95),
      player('third', 3, 80),
      player('fourth', 2, 70),
    ];

    const [team1, team2] = balanceTeams(players);

    const bestTeam = team1.some(p => p.id === 'best') ? team1 : team2;
    const secondTeam = team1.some(p => p.id === 'second') ? team1 : team2;

    expect(bestTeam).not.toBe(secondTeam);
  });

  it('divide um número par de jogadores em equipes iguais', () => {
    const players = Array.from({ length: 6 }, (_, i) => player(`p${i}`, (i % 5) + 1, i * 10));

    const [team1, team2] = balanceTeams(players);

    expect(team1.length).toBe(3);
    expect(team2.length).toBe(3);
  });
});
