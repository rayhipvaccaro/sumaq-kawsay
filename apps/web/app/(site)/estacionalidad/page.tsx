import type { Metadata } from 'next';
import { EstacionalidadView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Clima y temporadas · Sumaq Kawsay',
  description: 'Cuándo ir al Valle Sagrado.',
};

export default function Page() {
  return <EstacionalidadView />;
}
