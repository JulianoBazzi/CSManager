import { describe, expect, it } from 'vitest';

import { calculateMapStatus } from '~/utils/sweepstake';

const map = (one1: number, one2: number, two1: number, two2: number) => ({
  team_one_score_1: one1,
  team_one_score_2: one2,
  team_two_score_1: two1,
  team_two_score_2: two2,
});

describe('calculateMapStatus', () => {
  it('retorna "pending" para 0 a 0', () => {
    expect(calculateMapStatus(map(0, 0, 0, 0))).toBe('pending');
  });

  it('retorna "draw" quando os totais empatam com pontuação', () => {
    expect(calculateMapStatus(map(7, 6, 6, 7))).toBe('draw');
  });

  it('retorna "team_one" quando a soma da equipe um é maior', () => {
    expect(calculateMapStatus(map(13, 0, 5, 4))).toBe('team_one');
  });

  it('retorna "team_two" quando a soma da equipe dois é maior', () => {
    expect(calculateMapStatus(map(5, 4, 13, 0))).toBe('team_two');
  });

  it('soma os dois lados antes de comparar', () => {
    // Equipe um: 3+10=13; equipe dois: 8+4=12 -> team_one
    expect(calculateMapStatus(map(3, 10, 8, 4))).toBe('team_one');
  });
});
