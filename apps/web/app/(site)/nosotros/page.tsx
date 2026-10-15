import type { Metadata } from 'next';
import { NosotrosView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Sobre nosotros · Sumaq Kawsay',
  description: 'Quiénes somos: turismo sostenible y sabiduría andina en Inka Lab.',
};

export default function Page() {
  return <NosotrosView />;
}
