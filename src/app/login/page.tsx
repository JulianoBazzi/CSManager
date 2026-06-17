import { redirect } from 'next/navigation';

import { LoginForm } from '~/app/login/components/form';
import { getAuthUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({ title: 'Entrar' });

export default async function LoginPage() {
  const user = await getAuthUser();

  if (user) {
    redirect('/');
  }

  return <LoginForm />;
}
