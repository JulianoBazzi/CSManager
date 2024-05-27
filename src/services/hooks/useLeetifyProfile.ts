import axios from 'axios';

import ILeetifyProfileAPI from '~/models/ILeetifyProfileAPI';

export async function getLeetifyProfileScore(steamId?: string): Promise<number | undefined> {
  if (!steamId) {
    return undefined;
  }

  try {
    const response = await axios.get<ILeetifyProfileAPI>(`https://api.leetify.com/api/profile/${steamId}`);

    if (response.data.games.length > 0) {
      const lastMatch = response.data.games.filter((game) => game.dataSource === 'matchmaking' && game.skillLevel > 0)[0];
      if (lastMatch && lastMatch?.skillLevel > 1000) {
        return lastMatch?.skillLevel;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('steamId', error);
  }

  return undefined;
}
