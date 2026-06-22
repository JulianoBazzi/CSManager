import { formatDate } from '@julianobazzi/utils';
import { NextResponse } from 'next/server';
import type ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import { getSweepstakeMaps } from '~/services/hooks/useSweepstakeMaps';
import { getSweepstake } from '~/services/hooks/useSweepstakes';

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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID do sorteio é obrigatório' }, { status: 400 });
    }

    const sweepstake = await getSweepstake(id);

    if (!sweepstake) {
      return NextResponse.json({ error: 'Sorteio não encontrado' }, { status: 404 });
    }

    const sweepstakeMaps = await getSweepstakeMaps(id);

    return NextResponse.json({
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
    return NextResponse.json({ error: 'An error occurred while generating the data' }, { status: 400 });
  }
}
