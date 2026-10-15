import type { Metadata } from 'next';
import { ReservarView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Reservar · Sumaq Kawsay',
  description: 'Reserva hospedaje, actividades y comidas en un solo recorrido.',
};

export default function Page() {
  return <ReservarView />;
}
