'use client';

import { BusinessPortalModal } from '@/components/BusinessPortalModal';
import { PageHeader } from '@/components/admin/PageHeader';

export default function FinanzasPage() {
  return (
    <>
      <PageHeader
        title="Pagos y contabilidad"
        help="Ventas concretadas, comprobantes, IGV estimado y deudas con proveedores. Registra pagos y cobros."
      />
      <BusinessPortalModal isOpen onClose={() => {}} embedded forceRole="contador" />
    </>
  );
}
