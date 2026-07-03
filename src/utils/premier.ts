import { onlyNumbers } from '@julianobazzi/utils';

/**
 * Extrai o pico de Premier da página csstats.gg/player/{steam_id} (leaderboard
 * da Valve). O painel de ranks mostra Premier nas colunas "Rank" (atual) e
 * "Best" (pico) e no gráfico de partidas, todos como
 * `<div class="cs2rating ...">10<small>,104</small></div>`. O pico é sempre o
 * maior valor entre eles. Sem `cs2rating` (jogador não rastreado) -> 0.
 */
export function extractPeak(html: string): number {
  const numbers: number[] = [];
  const regex = /cs2rating[^>]*>([\s\S]*?)<\/div>/g;
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: padrão idiomático de exec em loop
  while ((match = regex.exec(html)) !== null) {
    const digits = onlyNumbers(match[1].replace(/<[^>]*>/g, ''));
    if (digits) {
      numbers.push(Number.parseInt(digits, 10));
    }
  }
  return numbers.length > 0 ? Math.max(...numbers) : 0;
}
