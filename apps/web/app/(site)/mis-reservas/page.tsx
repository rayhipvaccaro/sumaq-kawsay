import type { Metadata } from 'next';
import { MisReservasView } from '@/components/site/MisReservasView';

export const metadata: Metadata = {
  title: 'Mis reservas · Sumaq Kawsay',
  description: 'Mira tus reservas y tus próximos viajes.',
};

export default function Page() {
  return <MisReservasView />;
}
