import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { SCRAPE_DO_TOKEN } from '~/config/constants';

export const config = { maxDuration: 60 };

const SCRAPE_DO_URL = 'https://api.scrape.do/';
const MAX_ATTEMPTS = 2;
const CONCURRENCY = 5;

interface IPremierResult {
  steam_id: string;
  premier: number | null;
}

// Extrai o pico de Premier da página csstats.gg/player/{steam_id} (leaderboard da Valve).
// O painel de ranks mostra Premier nas colunas "Rank" (atual) e "Best" (pico) e o gráfico
// de partidas, todos como `<div class="cs2rating ...">10<small>,104</small></div>`. O pico
// é sempre o maior valor entre eles (Best >= atual >= partidas). Sem `cs2rating`
// (jogador não rastreado no csstats) -> 0.
function extractPeak(html: string): number {
  const numbers: number[] = [];
  const regex = /cs2rating[^>]*>([\s\S]*?)<\/div>/g;
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: padrão idiomático de exec em loop
  while ((match = regex.exec(html)) !== null) {
    const digits = match[1].replace(/<[^>]*>/g, '').replace(/\D/g, '');
    if (digits) {
      numbers.push(Number.parseInt(digits, 10));
    }
  }
  return numbers.length > 0 ? Math.max(...numbers) : 0;
}

async function fetchPremier(steam_id: string): Promise<number | null> {
  const target = `https://csstats.gg/player/${steam_id}`;
  const url =
    `${SCRAPE_DO_URL}?token=${SCRAPE_DO_TOKEN}` +
    `&url=${encodeURIComponent(target)}&super=true`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { data: html } = await axios.get<string>(url, { responseType: 'text' });
      return extractPeak(html);
    } catch {
      if (attempt >= MAX_ATTEMPTS) {
        return null;
      }
    }
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { steam_ids } = req.body as { steam_ids?: string[] };
  if (!Array.isArray(steam_ids) || steam_ids.length === 0) {
    res.status(400).json({ error: 'No steam_ids provided' });
    return;
  }

  try {
    const results: IPremierResult[] = [];

    for (let i = 0; i < steam_ids.length; i += CONCURRENCY) {
      const chunk = steam_ids.slice(i, i + CONCURRENCY);
      const premiers = await Promise.all(chunk.map(steam_id => fetchPremier(steam_id)));
      chunk.forEach((steam_id, j) => {
        results.push({ steam_id, premier: premiers[j] });
      });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
