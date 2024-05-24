/* eslint-disable max-len */
import { NextApiRequest, NextApiResponse } from 'next';

import { openai } from '~/config/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { players } = req.body;
  if (!players || players.length === 0) {
    res.status(400).json({ error: 'No players provided' });
    return;
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `Divida estes ${players.length} jogadores em duas equipes, respeitando as seguintes regras:`,
        },
        {
          role: 'system',
          content: '1: As duas equipes devem ter uma somatória de pontuação dos jogadores próximas;',
        },
        {
          role: 'system',
          content: '2: A diferença na quantidade de jogadores entre as equipes não deve ser superior a um jogador;',
        },
        {
          role: 'system',
          content: '3: As equipes devem ser ordenadas do melhor jogador para o pior.',
        },
        {
          role: 'system',
          content: 'Exemplo: "Pedro (0 pontos)", "Fulano (5000 pontos)", "João (6000 pontos)", "Gustavo (10000 pontos)", "Falen (16000 pontos)". O resultado correto seria, Time 1: Falen e Pedro. Time 2: Gustavo, João e Fulano.',
        },
        {
          role: 'system',
          content: 'Retorne somente o ids dos jogadores de cada equipe convertido em json, nada além disso.',
        },
        { role: 'user', content: JSON.stringify(players) },
      ],
    });

    const data = await response.json();

    res.status(200).json(data.choices[0].message.content);
  } catch (error) {
    res.status(500).json({ error });
  }
}
