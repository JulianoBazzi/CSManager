import { describe, expect, it } from 'vitest';

import type IPlayerScoreAPI from '~/models/Entity/Player/IPlayerScoreAPI';
import balanceTeams from '~/utils/balanceTeams';

const player = (id: string, rating: number, score: number): IPlayerScoreAPI => ({ id, rating, score });

const allIds = (teams: [IPlayerScoreAPI[], IPlayerScoreAPI[]]) =>
  [...teams[0], ...teams[1]].map(p => p.id).sort();

const teamIds = (team: IPlayerScoreAPI[]) => team.map(p => p.id).sort();

const teamScoreSum = (team: IPlayerScoreAPI[]) => team.reduce((sum, p) => sum + p.score, 0);

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

  it('encontra a partição perfeita quando o score decide (ratings iguais, número par)', () => {
    const players = [
      player('a', 3, 100),
      player('b', 3, 90),
      player('c', 3, 60),
      player('d', 3, 50),
      player('e', 3, 40),
      player('f', 3, 20),
    ];

    const [team1, team2] = balanceTeams(players);

    expect(teamIds(team1)).toEqual(['a', 'c', 'f']);
    expect(teamIds(team2)).toEqual(['b', 'd', 'e']);
    expect(teamScoreSum(team1)).toBe(teamScoreSum(team2));
  });

  it('encontra a partição perfeita com número ímpar de jogadores', () => {
    const players = [
      player('a', 3, 100),
      player('b', 3, 80),
      player('c', 3, 60),
      player('d', 3, 40),
      player('e', 3, 20),
    ];

    const [team1, team2] = balanceTeams(players);

    expect(teamIds(team1)).toEqual(['a', 'd']);
    expect(teamIds(team2)).toEqual(['b', 'c', 'e']);
    expect(Math.abs(team1.length - team2.length)).toBe(1);
  });

  it('equilibra pelas estrelas quando ninguém tem score', () => {
    const players = [
      player('five', 5, 0),
      player('four', 4, 0),
      player('three', 3, 0),
      player('two', 2, 0),
    ];

    const [team1, team2] = balanceTeams(players);

    expect(teamIds(team1)).toEqual(['five', 'two']);
    expect(teamIds(team2)).toEqual(['four', 'three']);
  });

  it('imputa a média do grupo para jogador sem score, sem tratá-lo como o pior', () => {
    const players = [
      player('a', 3, 100),
      player('b', 3, 0),
      player('c', 3, 90),
      player('d', 3, 60),
    ];

    const [team1, team2] = balanceTeams(players);

    expect(teamIds(team1)).toEqual(['a', 'd']);
    expect(teamIds(team2)).toEqual(['b', 'c']);
    expect(players[1].score).toBe(0);
  });

  it('não muta a entrada e retorna as mesmas referências de objeto', () => {
    const players = [
      player('a', 5, 100),
      player('b', 4, 90),
      player('c', 3, 80),
      player('d', 2, 70),
    ];
    const originalOrder = players.map(p => p.id);

    const [team1, team2] = balanceTeams(players);

    expect(players.map(p => p.id)).toEqual(originalOrder);
    expect([...team1, ...team2].every(p => players.includes(p))).toBe(true);
  });

  it('é determinístico para entradas equivalentes', () => {
    const makePlayers = () => [
      player('a', 4, 120),
      player('b', 4, 80),
      player('c', 2, 100),
      player('d', 5, 60),
      player('e', 3, 60),
      player('f', 1, 40),
      player('g', 3, 90),
    ];

    const first = balanceTeams(makePlayers());
    const second = balanceTeams(makePlayers());

    expect(first[0].map(p => p.id)).toEqual(second[0].map(p => p.id));
    expect(first[1].map(p => p.id)).toEqual(second[1].map(p => p.id));
  });

  it('coloca o jogador mais forte na equipe um', () => {
    const players = [
      player('c', 2, 30),
      player('a', 5, 500),
      player('d', 3, 40),
      player('b', 1, 10),
    ];

    const [team1] = balanceTeams(players);

    expect(team1.some(p => p.id === 'a')).toBe(true);
  });

  it('lida com casos degenerados', () => {
    expect(balanceTeams([])).toEqual([[], []]);

    const single = player('a', 3, 50);
    expect(balanceTeams([single])).toEqual([[single], []]);

    const pair = balanceTeams([player('weak', 1, 10), player('strong', 5, 100)]);
    expect(pair[0].map(p => p.id)).toEqual(['strong']);
    expect(pair[1].map(p => p.id)).toEqual(['weak']);

    const trio = balanceTeams([player('best', 5, 100), player('mid', 3, 50), player('low', 1, 10)]);
    expect(Math.abs(trio[0].length - trio[1].length)).toBe(1);
    const bestInOne = trio[0].some(p => p.id === 'best');
    const midInOne = trio[0].some(p => p.id === 'mid');
    expect(bestInOne).not.toBe(midInOne);
  });

  it('não falha quando todos os jogadores são idênticos', () => {
    const players = Array.from({ length: 4 }, (_, i) => player(`p${i}`, 3, 50));

    const teams = balanceTeams(players);

    expect(allIds(teams)).toEqual(['p0', 'p1', 'p2', 'p3']);
    expect(teams[0].length).toBe(2);
    expect(teams[1].length).toBe(2);
  });

  it('resolve grupos grandes dentro do tempo esperado', () => {
    const buildPlayers = (count: number) =>
      Array.from({ length: count }, (_, i) => player(`p${i}`, ((i * 7) % 10) / 2 + 0.5, 500 + ((i * 37) % 400)));

    const start = performance.now();
    const exact = balanceTeams(buildPlayers(20));
    const heuristic = balanceTeams(buildPlayers(30));
    const elapsed = performance.now() - start;

    expect(allIds(exact)).toHaveLength(20);
    expect(Math.abs(exact[0].length - exact[1].length)).toBeLessThanOrEqual(1);
    expect(allIds(heuristic)).toHaveLength(30);
    expect(Math.abs(heuristic[0].length - heuristic[1].length)).toBeLessThanOrEqual(1);
    expect(elapsed).toBeLessThan(2000);
  });
});
