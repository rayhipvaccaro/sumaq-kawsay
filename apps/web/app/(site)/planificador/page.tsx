import type { Metadata } from 'next';
import { PlanificadorView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Planifica tu viaje · Sumaq Kawsay',
  description: 'Arma tu ruta y mira el precio estimado.',
};

export default function Page() {
  return <PlanificadorView />;
}
