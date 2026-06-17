import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SweepstakeForm } from '~/app/sweepstakes/[id]/components/form';
import { getSweepstake } from '~/services/hooks/useSweepstakes';
import { getAuthUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sweepstake = await getSweepstake(id);

  if (!sweepstake) {
    return createMetadata({ title: 'Sorteio' });
  }

  return createMetadata({
    title: `${sweepstake.format_short_game_type}: ${sweepstake.format_departure_at}`,
    description: `Partida com ${sweepstake.quantity_players} jogadores e ${sweepstake.quantity_maps} mapas.`,
  });
}

export default async function SweepstakeByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sweepstake = await getSweepstake(id);

  if (!sweepstake) {
    redirect('/');
  }

  const user = await getAuthUser();

  return <SweepstakeForm user={user ?? undefined} sweepstake={sweepstake} />;
}
