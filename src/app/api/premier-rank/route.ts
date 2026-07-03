import axios from 'axios';
import { NextResponse } from 'next/server';

import { SCRAPE_DO_TOKEN } from '~/config/constants';
import { extractPeak } from '~/utils/premier';

export const maxDuration = 60;

const SCRAPE_DO_URL = 'https://api.scrape.do/';
const MAX_ATTEMPTS = 2;
const CONCURRENCY = 5;

interface IPremierResult {
  steam_id: string;
  premier: number | null;
}

async function fetchPremier(steam_id: string): Promise<number | null> {
  const target = `https://csstats.gg/player/${steam_id}`;
  const url = `${SCRAPE_DO_URL}?token=${SCRAPE_DO_TOKEN}` + `&url=${encodeURIComponent(target)}&super=true`;

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

export async function POST(request: Request) {
  const { steam_ids } = (await request.json()) as { steam_ids?: string[] };

  if (!Array.isArray(steam_ids) || steam_ids.length === 0) {
    return NextResponse.json({ error: 'No steam_ids provided' }, { status: 400 });
  }

  if (!SCRAPE_DO_TOKEN) {
    return NextResponse.json({ error: 'Variável de ambiente ausente: SCRAPE_DO_TOKEN.' }, { status: 500 });
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

    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
