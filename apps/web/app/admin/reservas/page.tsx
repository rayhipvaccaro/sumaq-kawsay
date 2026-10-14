'use client';

import { BusinessPortalModal } from '@/components/BusinessPortalModal';
import { PageHeader } from '@/components/admin/PageHeader';

export default function ReservasPage() {
  return (
    <>
      <PageHeader
        title="Reservas y cotizaciones"
        help="Lista de clientes que pidieron cotización o reservaron. Envía correo o WhatsApp, concreta la venta o declárala para liberar cupos."
      />
      <BusinessPortalModal isOpen onClose={() => {}} embedded forceRole="ventas" />
    </>
  );
}
