import { describe, expect, it } from 'vitest';

import { extractPeak } from '~/utils/premier';

const rating = (value: string) => `<div class="cs2rating cs2rating-c">${value}</div>`;

describe('extractPeak', () => {
  it('retorna 0 quando não há nenhum cs2rating', () => {
    expect(extractPeak('<div>sem rank</div>')).toBe(0);
  });

  it('lê um rating com a tag <small> de milhares', () => {
    expect(extractPeak(rating('10<small>,104</small>'))).toBe(10104);
  });

  it('retorna o maior valor entre atual, pico e partidas', () => {
    const html = `${rating('9<small>,000</small>')}${rating('12<small>,500</small>')}${rating('8<small>,750</small>')}`;
    expect(extractPeak(html)).toBe(12500);
  });

  it('ignora conteúdo não numérico', () => {
    expect(extractPeak('<div class="cs2rating">Unranked</div>')).toBe(0);
  });
});
