import type { Metadata } from 'next';
import { ZonasView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Zonas sagradas · Sumaq Kawsay',
  description: 'Hanan Pacha, Willka Unu e Inti Punku: tres recorridos en Inka Lab.',
};

export default function Page() {
  return <ZonasView />;
}
