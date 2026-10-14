'use client';

import { useParams } from 'next/navigation';
import { AdminCMSModal, type CmsTab } from '@/components/AdminCMSModal';
import { PageHeader } from '@/components/admin/PageHeader';

const TABS: Record<string, { title: string; help: string }> = {
  tours: { title: 'Paquetes y experiencias', help: 'Crea, edita o quita los paquetes, hospedajes y actividades que se muestran en el sitio: nombre, precio, fotos y descripción.' },
  content: { title: 'Textos y fotos del sitio', help: 'Cambia los títulos, textos y datos de contacto de la página principal.' },
  testimonials: { title: 'Testimonios', help: 'Agrega o quita las opiniones de turistas que aparecen en el sitio.' },
  contacts: { title: 'Contactos y consultas', help: 'Mensajes que dejaron los visitantes. Márcalos como contactado o en proceso y bórralos cuando termines.' },
  settings: { title: 'Seguridad y respaldos', help: 'Respaldo y restauración de datos del sitio. Solo para el administrador general.' },
};

export default function CmsTabPage() {
  const { tab } = useParams<{ tab: string }>();
  const t = TABS[tab];
  if (!t) return <p>Sección no encontrada.</p>;
  return (
    <>
      <PageHeader title={t.title} help={t.help} />
      <AdminCMSModal key={tab} embedded initialTab={tab as CmsTab} />
    </>
  );
}
