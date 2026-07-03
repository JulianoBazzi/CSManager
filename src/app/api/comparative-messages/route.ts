import { NextResponse } from 'next/server';

import { openai } from '~/config/openai';
import { parseJsonFromCompletion } from '~/utils/openai';

export async function POST(request: Request) {
  const body = await request.json();
  const { player_one, player_two } = body;

  if (!player_one) {
    return NextResponse.json({ error: 'No player_one provided' }, { status: 400 });
  }

  if (!player_two) {
    return NextResponse.json({ error: 'No player_two provided' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.5',
      response_format: { type: 'json_object' },
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
          content:
            'Compare o atributo de cada jogador e gere uma mensagem engraçada/trocadinho para cada atributo do Counter-Strike;',
        },
        {
          role: 'system',
          content:
            'Gere a mensagem apenas para o player vencedor naquele atributo e não precisa repetir o número/percentual do atributo ou o nome do jogador na mensagem;',
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
          content:
            'Exemplo 3: "Maior percentual de tiro na cabeça? Dizem que até as balas desviam pra acertar o headshot!".',
        },
        {
          role: 'system',
          content: 'Exemplo 4: "Maior percentual de tiros na cabeça... Sniper profissional ou tá com o aimbot ativado?',
        },
        {
          role: 'system',
          content:
            'Retorne somente o objeto com "damage, death, kill..." com a mensagem de cada atributo em json, nada além disso.',
        },
        { role: 'user', content: JSON.stringify(body) },
      ],
    });

    return NextResponse.json(parseJsonFromCompletion(response));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while generating the data' },
      { status: 500 }
    );
  }
}
