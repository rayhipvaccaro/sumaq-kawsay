import type { Metadata } from 'next';
import { IngresarView } from '@/components/site/IngresarView';

export const metadata: Metadata = {
  title: 'Ingresar · Sumaq Kawsay',
  description: 'Entra a tu cuenta para ver y pagar tus reservas.',
};

export default function Page() {
  return <IngresarView />;
}
