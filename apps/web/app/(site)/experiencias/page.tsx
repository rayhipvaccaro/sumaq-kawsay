import type { Metadata } from 'next';
import { ExperienciasView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Tours y actividades · Sumaq Kawsay',
  description: 'Catálogo de tours y actividades con cupos reales.',
};

export default function Page() {
  return <ExperienciasView />;
}
