import { RankingForm } from '~/app/ranking/[id]/components/form';
import { getAuthUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

export const metadata = createMetadata({
  title: 'Ranking',
  description: 'Veja o ranking com os melhores jogadores.',
});

export default async function RankingByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();

  return <RankingForm user={user ?? undefined} userId={id} />;
}
