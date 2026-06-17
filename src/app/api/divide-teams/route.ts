import { NextResponse } from 'next/server';

import { openai } from '~/config/openai';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body || body.length === 0) {
    return NextResponse.json({ error: 'No players provided' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [
        {
          role: 'system',
          content: `Divida estes ${body.length} jogadores em duas equipes, respeitando as seguintes regras:`,
        },
        {
          role: 'system',
          content: '1º As duas equipes devem ter uma somatória de pontuação dos jogadores próximas;',
        },
        {
          role: 'system',
          content:
            '2º Leve em consideração o campo Star (Sendo 5 o melhor e 1 o pior jogador). Exemplo: Se o time 1 tem um jogador 5 estrelas, o time 2 deve ter um jogador 5 estrelas também (se houver);',
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
          content:
            'Exemplo: "Pedro (0 pontos)", "Fulano (50 pontos)", "João (60 pontos)", "Gustavo (100 pontos)", "Falen (160 pontos)". O resultado correto seria, Time 1: Falen e Pedro. Time 2: Gustavo, João e Fulano.',
        },
        {
          role: 'system',
          content: 'Retorne somente o proprio objeto dos jogadores de cada equipe convertido em json, nada além disso.',
        },
        { role: 'user', content: JSON.stringify(body) },
      ],
    });

    if (!response.choices[0].message.content) {
      return NextResponse.json({ error: 'An error occurred while generating the data' }, { status: 400 });
    }

    return NextResponse.json(JSON.parse(response.choices[0].message.content.replace(/`/g, '').replace('json', '')));
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
