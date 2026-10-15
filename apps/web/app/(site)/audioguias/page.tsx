import type { Metadata } from 'next';
import { AudioguiasView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'QR y audioguías · Sumaq Kawsay',
  description: 'Escucha la historia de cada zona con tu celular.',
};

export default function Page() {
  return <AudioguiasView />;
}
