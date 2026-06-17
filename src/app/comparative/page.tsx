import { redirect } from 'next/navigation';

import { getAuthUser } from '~/utils/auth';

export default async function ComparativePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/');
  }

  redirect(`/comparative/${user.id}`);
}
