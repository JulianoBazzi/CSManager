import { NewSweepstakeForm } from '~/app/sweepstakes/new/components/form';
import { ensureAuthenticatedUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Novo Sorteio' });

export default async function NewSweepstakePage() {
  const user = await ensureAuthenticatedUser();

  return <NewSweepstakeForm user={user} />;
}
