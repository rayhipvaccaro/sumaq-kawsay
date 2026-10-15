import type { Metadata } from 'next';
import { ServiciosView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Servicios y tarifas · Sumaq Kawsay',
  description: 'Hospedaje, restaurante, spa y pasadía en Inka Lab Km 84.',
};

export default function Page() {
  return <ServiciosView />;
}
