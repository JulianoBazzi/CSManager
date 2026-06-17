import type { Metadata } from 'next';

interface IPageMetadataProps {
  title?: string;
  description?: string;
  brand?: string | null;
}

export function createMetadata({ title, description, brand }: IPageMetadataProps = {}): Metadata {
  const suffix = brand ?? 'CS Manager';

  return {
    title: title ? `${title} | ${suffix}` : suffix,
    description: description ?? 'Gerencie jogadores, mapas, sorteios e rankings de Counter-Strike.',
  };
}
