import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticuloView } from '@/components/site/views';
import { PRESS_ARTICLES } from '@/data/press';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = PRESS_ARTICLES.find((x) => x.slug === slug);
  return a ? { title: `${a.title} · Sumaq Kawsay`, description: a.summary } : { title: 'Artículo · Sumaq Kawsay' };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!PRESS_ARTICLES.some((x) => x.slug === slug)) notFound();
  return <ArticuloView slug={slug} />;
}
