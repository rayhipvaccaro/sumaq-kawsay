import type { Metadata } from 'next';
import { ContactoView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Contacto · Sumaq Kawsay',
  description: 'Escríbenos para planear tu viaje.',
};

export default function Page() {
  return <ContactoView />;
}
