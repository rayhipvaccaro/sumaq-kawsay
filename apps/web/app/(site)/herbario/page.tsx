import type { Metadata } from 'next';
import { HerbarioView } from '@/components/site/views';

export const metadata: Metadata = {
  title: 'Herbario vivo · Sumaq Kawsay',
  description: 'Plantas medicinales y etnobotánica andina en Chillca.',
};

export default function Page() {
  return <HerbarioView />;
}
