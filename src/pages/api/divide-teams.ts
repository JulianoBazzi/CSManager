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
      model: 'gpt-3.5-turbo-0125',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente encarregado de criar dois times equilibrados de jogadores de CS2 (Counter-Strike 2) com base em seus rankings no modo Premier (Especial). A entrada é um JSON contendo uma lista de jogadores com nome e pontuação.',
        },
        {
          role: 'system',
          content: 'Sua tarefa é dividir os jogadores em duas equipes observando as seguintes regras: a somatória de pontuação das duas equipe devem ser próximas e a diferença no número de jogadores de uma equipe para outra não pode ser superior a um jogador.',
        },
        {
          role: 'system',
          content: 'Retorne somente o texto convertido, nada além disso.',
        },
        { role: 'user', content: JSON.stringify(players) },
      ],
    });

    const data = await response.json();

    console.log('data', data);

    res.status(200).json(data.choices[0].message.content);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Error processing request' });
  }
}
