/* eslint-disable max-len */
import { NextApiRequest, NextApiResponse } from 'next';

import { openai } from '~/config/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  if (!req.body || req.body.length === 0) {
    res.status(400).json({ error: 'No players provided' });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `Divida estes ${req.body.length} jogadores em duas equipes, respeitando as seguintes regras:`,
        },
        {
          role: 'system',
          content: '1º As duas equipes devem ter uma somatória de pontuação dos jogadores próximas;',
        },
        {
          role: 'system',
          content: '2º Leve em consideração o campo Star (Sendo 5 o melhor e 1 o pior jogador). Exemplo: Se o time 1 tem um jogador 5 estrelas, o time 2 deve ter um jogador 5 estrelas também (se houver);',
        },
        {
          role: 'system',
          content: '3º A diferença na quantidade de jogadores entre as equipes não deve ser superior a um jogador;',
        },
        {
          role: 'system',
          content: '4º As equipes devem ser ordenadas do melhor jogador para o pior.',
        },
        {
          role: 'system',
          content: 'Exemplo: "Pedro (0 pontos)", "Fulano (50 pontos)", "João (60 pontos)", "Gustavo (100 pontos)", "Falen (160 pontos)". O resultado correto seria, Time 1: Falen e Pedro. Time 2: Gustavo, João e Fulano.',
        },
        {
          role: 'system',
          content: 'Retorne somente o proprio objeto dos jogadores de cada equipe convertido em json, nada além disso.',
        },
        { role: 'user', content: JSON.stringify(req.body) },
      ],
    });

    if (!response.choices[0].message.content) {
      res.status(400).json({ error: 'An error occurred while generating the data' });
      return;
    }

    res.status(200).json(JSON.parse(response.choices[0].message.content.replace(/`/g, '').replace('json', '')));
  } catch (error) {
    res.status(500).json({ error });
  }
}
