import type { Metadata } from 'next';
import { GaleriaView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Galería · Sumaq Kawsay',
  description: 'Fotos de Inka Lab y el Valle Sagrado.',
};

export default function Page() {
  return <GaleriaView />;
}
