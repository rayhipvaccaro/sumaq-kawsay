import type { Metadata } from 'next';
import { ComoLlegarView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Cómo llegar · Sumaq Kawsay',
  description: 'Cómo llegar al Km 84 de Ollantaytambo desde Cusco.',
};

export default function Page() {
  return <ComoLlegarView />;
}
