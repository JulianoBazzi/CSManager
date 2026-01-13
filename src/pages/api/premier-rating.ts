import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { steamId } = req.query;

  if (!steamId || typeof steamId !== 'string') {
    return res.status(400).json({ error: 'steamId é obrigatório' });
  }

  try {
    const response = await axios.get(`https://csstats.gg/player/${steamId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
        Referer: 'https://www.google.com/',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    let premierRating: number | undefined;

    $('div, span, p, td, th, h1, h2, h3, h4').each((_, element) => {
      const text = $(element).text().trim();

      if (text.includes('Premier') || text.includes('Rating') || text.includes('CS Rating')) {
        const match = text.match(/(\d{4,5})/);
        if (match) {
          const rating = Number.parseInt(match[1], 10);
          if (rating > 1000 && rating < 50000) {
            premierRating = rating;
            return false;
          }
        }
      }
    });

    return res.status(200).json({ rating: premierRating });
    // biome-ignore lint/suspicious/noExplicitAny: <ignore>
  } catch (error: any) {
    console.log('Erro ao buscar rating:', error?.message);
    return res.status(500).json({ error: 'Erro ao buscar rating', message: error?.message });
  }
}
