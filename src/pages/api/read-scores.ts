/* eslint-disable max-len */
import { NextApiRequest, NextApiResponse } from 'next';

import { openai } from '~/config/openai';
import ILeaderboardAPI from '~/models/Entity/Leaderboard/ILeaderboardAPI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { image_url } = req.body;
  if (!image_url) {
    res.status(400).json({ error: 'No image_url provided' });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0,
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
      res.status(400).json({ error: 'An error occurred while generating the data' });
      return;
    }

    const leaderboard: ILeaderboardAPI = JSON.parse(response.choices[0].message.content.replace(/`/g, '').replace('json', ''));
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error });
  }
}
