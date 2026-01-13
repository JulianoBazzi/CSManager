// pages/api/sweepstakes/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import type ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import { getSweepstakeMaps } from '~/services/hooks/useSweepstakeMaps';
import { getSweepstake } from '~/services/hooks/useSweepstakes';
import { formatDate } from '~/utils/formatDate';

function calculateMapStatus({
  team_one_score_1,
  team_one_score_2,
  team_two_score_1,
  team_two_score_2,
}: ISweepstakeMapAPI): string {
  const teamOneTotal = team_one_score_1 + team_one_score_2;
  const teamTwoTotal = team_two_score_1 + team_two_score_2;

  if (teamOneTotal === teamTwoTotal && teamOneTotal > 0) {
    return 'draw';
  }

  if (teamOneTotal > teamTwoTotal) {
    return 'team_one';
  }

  if (teamTwoTotal > teamOneTotal) {
    return 'team_two';
  }

  return 'pending';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'ID do sorteio é obrigatório' });
      return;
    }

    const sweepstake = await getSweepstake(id);

    if (!sweepstake) {
      res.status(404).json({ error: 'Sorteio não encontrado' });
      return;
    }

    const sweepstakeMaps = await getSweepstakeMaps(id);

    res.status(200).json({
      id: sweepstake.id,
      departure_at: formatDate(sweepstake.departure_at),
      team_start_from_terrorist: sweepstakeMaps[0].team_start_from_terrorist === 0 ? 'team_one' : 'team_two',
      maps: sweepstakeMaps.map(sweepstakeMap => ({
        id: sweepstakeMap.id,
        map_type: sweepstakeMap.maps.map_type,
        name: sweepstakeMap.maps.name,
        team_one_score_1: sweepstakeMap.team_one_score_1,
        team_one_score_2: sweepstakeMap.team_one_score_2,
        team_two_score_1: sweepstakeMap.team_two_score_1,
        team_two_score_2: sweepstakeMap.team_two_score_2,
        status: calculateMapStatus(sweepstakeMap),
      })),
    });
  } catch (error) {
    console.error('Error fetching sweepstake:', error);
    res.status(400).json({ error: 'An error occurred while generating the data' });
  }
}
