import { redirect } from 'next/navigation';

import { getAuthUser } from '~/utils/auth';

export default async function RankingPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/');
  }

  redirect(`/ranking/${user.id}`);
}
