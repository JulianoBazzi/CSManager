import { ChangePasswordForm } from '~/app/changePassword/components/form';
import { ensureAuthenticatedUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Alterar Senha' });

export default async function ChangePasswordPage() {
  const user = await ensureAuthenticatedUser();

  return <ChangePasswordForm user={user} />;
}
