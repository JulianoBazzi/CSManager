import { ProfileForm } from '~/app/profile/components/form';
import { ensureAuthenticatedUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Meu Perfil' });

export default async function ProfilePage() {
  const user = await ensureAuthenticatedUser();

  return <ProfileForm user={user} />;
}
