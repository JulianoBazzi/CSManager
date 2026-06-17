import { MapsForm } from '~/app/maps/components/form';
import { ensureAuthenticatedUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Mapas' });

export default async function MapsPage() {
  const user = await ensureAuthenticatedUser();

  return <MapsForm user={user} />;
}
