import type { Metadata } from 'next';
import { HomeView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Sumaq Kawsay · Turismo sostenible en el Valle Sagrado',
  description: 'Hospedaje, caminatas, herbario vivo y experiencias con guías locales en el Km 84 de Ollantaytambo.',
};

export default function Page() {
  return <HomeView />;
}
