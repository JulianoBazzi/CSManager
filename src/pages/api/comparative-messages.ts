/* eslint-disable max-len */
import { NextApiRequest, NextApiResponse } from 'next';

import { openai } from '~/config/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { player_one, player_two } = req.body;
  if (!player_one) {
    res.status(400).json({ error: 'No player_one provided' });
    return;
  }

  if (!player_two) {
    res.status(400).json({ error: 'No player_two provided' });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 1,
      messages: [
        {
          role: 'system',
          content: 'Esta são as informações do primeiro jogador:',
        },
        { role: 'user', content: JSON.stringify(player_one) },
        {
          role: 'system',
          content: 'Esta são as informações do segundo jogador:',
        },
        { role: 'user', content: JSON.stringify(player_two) },
        {
          role: 'system',
          content: 'Compare o atributo de cada jogador e gere uma mensagem engraçada/trocadinho para cada atributo do Counter-Strike;',
        },
        {
          role: 'system',
          content: 'Gere a mensagem apenas para o player vencedor naquele atributo e não precisa repetir o número/percentual do atributo ou o nome do jogador na mensagem;',
        },
        {
          role: 'system',
          content: 'Abaixo esta o significado de cada atributo do CS2:',
        },
        {
          role: 'system',
          content: 'damage: Maior Dano Causado; (quanto mais, melhor)',
        },
        {
          role: 'system',
          content: 'kill: Mais Vítimas Eliminadas; (quanto mais, melhor)',
        },
        {
          role: 'system',
          content: 'assistance: Mais Assistências; (quanto mais, melhor)',
        },
        {
          role: 'system',
          content: 'death: Menos Mortes Sofridas; (quanto menos, melhor)',
        },
        {
          role: 'system',
          content: 'headshot: Maior Percentual de Tiros na Cabeça; (quanto mais, melhor)',
        },
        {
          role: 'system',
          content: 'quantity: Mais Partidas Disputadas; (quanto mais, melhor)',
        },
        {
          role: 'system',
          content: 'Exemplo 1: "Menos mortes sofridas? Tá jogando escondido atrás da parede?"',
        },
        {
          role: 'system',
          content: 'Exemplo 2: "Maior dano causado? Esse aí não joga, ele FAZ a guerra!"',
        },
        {
          role: 'system',
          content: 'Exemplo 3: "Maior percentual de tiro na cabeça? Dizem que até as balas desviam pra acertar o headshot!".',
        },
        {
          role: 'system',
          content: 'Exemplo 4: "Maior percentual de tiros na cabeça... Sniper profissional ou tá com o aimbot ativado?',
        },
        {
          role: 'system',
          content: 'Retorne somente o objeto com "damage, death, kill..." com a mensagem de cada atributo em json, nada além disso.',
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
