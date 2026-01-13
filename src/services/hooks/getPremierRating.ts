import axios from 'axios';

export async function getPremierRating(steamId?: string): Promise<number | undefined> {
  if (!steamId) {
    return undefined;
  }

  try {
    const response = await axios.get<{ rating?: number }>(`/api/premier-rating?steamId=${steamId}`);
    return response.data.rating;
  } catch (error) {
    console.log('steamId', error);
  }

  return undefined;
}
