import { Home } from '~/app/components/home';
import { getAuthUser } from '~/utils/auth';

export default async function HomePage() {
  const user = await getAuthUser();

  return <Home user={user ?? undefined} />;
}
