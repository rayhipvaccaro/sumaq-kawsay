'use client';

import { BusinessPortalModal } from '@/components/BusinessPortalModal';
import { PageHeader } from '@/components/admin/PageHeader';

export default function OperacionPage() {
  return (
    <>
      <PageHeader
        title="Stock y proveedores"
        help="Control de stock por área, proveedores y estadísticas generales del negocio. Solo administrador general."
      />
      <BusinessPortalModal isOpen onClose={() => {}} embedded forceRole="admin" />
    </>
  );
}
