import type { Metadata } from 'next';

import { ComparativeForm } from '~/app/comparative/[id]/components/form';
import { getAuthUser } from '~/utils/auth';
import { createMetadata } from '~/utils/metadata';

type SearchParams = Promise<{ p1?: string; p2?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { p1, p2 } = await searchParams;

  return createMetadata({
    title: p1 && p2 ? `${p1} vs ${p2}` : 'Comparativo entre Jogadores',
    description: 'Compare os jogadores para identificar quem é o mais habilidoso.',
  });
}

export default async function ComparativeByIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { p1, p2 } = await searchParams;
  const user = await getAuthUser();

  return <ComparativeForm user={user ?? undefined} userId={id} usernameOne={p1} usernameTwo={p2} />;
}
