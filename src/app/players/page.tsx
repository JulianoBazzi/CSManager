import { PlayersForm } from '~/app/players/components/form';
import { ensureAuthenticatedUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Jogadores' });

export default async function PlayersPage() {
  const user = await ensureAuthenticatedUser();

  return <PlayersForm user={user} />;
}
