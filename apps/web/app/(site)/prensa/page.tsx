import type { Metadata } from 'next';
import { PrensaView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Prensa y cultura · Sumaq Kawsay',
  description: 'Artículos sobre arqueología y cosmovisión andina.',
};

export default function Page() {
  return <PrensaView />;
}
