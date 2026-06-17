import { NextResponse } from 'next/server';

import { openai } from '~/config/openai';
import type ILeaderboardAPI from '~/models/Entity/Leaderboard/ILeaderboardAPI';

export async function POST(request: Request) {
  const { image_url } = await request.json();

  if (!image_url) {
    return NextResponse.json({ error: 'No image_url provided' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [
        {
          role: 'system',
          content: 'Return only the text, nothing more.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Read the image and return its data to me in a string. Give me back: game, map and an array of players with: name, kills, deaths, assistances, headshot_percentage and damage.',
            },
            {
              type: 'image_url',
              image_url: {
                url: image_url,
              },
            },
          ],
        },
      ],
    });

    if (!response.choices[0].message.content) {
      return NextResponse.json({ error: 'An error occurred while generating the data' }, { status: 400 });
    }

    const leaderboard: ILeaderboardAPI = JSON.parse(
      response.choices[0].message.content.replace(/`/g, '').replace('json', '')
    );

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
