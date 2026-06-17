import { SweepstakesForm } from '~/app/sweepstakes/components/form';
import { ensureAuthenticatedUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Sorteios' });

export default async function SweepstakesPage() {
  const user = await ensureAuthenticatedUser();

  return <SweepstakesForm user={user} />;
}
