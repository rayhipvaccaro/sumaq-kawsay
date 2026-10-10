'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCMS } from '@/lib/cmsContext';
import { AdminCMSModal } from '@/components/AdminCMSModal';
import { BusinessPortalModal } from '@/components/BusinessPortalModal';
import { ManualModal } from '@/components/ManualModal';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Briefcase, Calculator, BookOpen } from 'lucide-react';

export default function AdminPage() {
  const {
    openAdminModal,
    openBusinessPortal,
    isBusinessPortalOpen,
    closeBusinessPortal,
    openManualModal,
    isManualModalOpen,
    closeManualModal,
    manualActiveTab,
  } = useCMS();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#181513] text-stone-100 flex flex-col justify-between p-6">
      <div className="max-w-4xl mx-auto w-full pt-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Página Principal (Sumaq Kawsay)</span>
          </Link>

          <span className="text-xs uppercase font-mono tracking-wider text-stone-400">
            Sumaq Kawsay ERP & CMS v3.0 · Operador Oficial
          </span>
        </div>

        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#221E1B] border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Panel de Operaciones & Sistema de Roles
          </h1>
          <p className="text-stone-300 max-w-lg mx-auto text-sm leading-relaxed">
            Gestión interconectada del negocio: Ventas & Marketing, Contador & Facturación, Control de Stock por Área, Proveedores y Contenido Web.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openBusinessPortal('ventas')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Portal de Roles (Ventas, Contador, Admin)</span>
            </button>

            <button
              onClick={openAdminModal}
              className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B38F24] text-[#181513] font-bold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel CMS Visual</span>
            </button>

            <button
              onClick={() => openManualModal('sistema')}
              className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Manual de Sistema & Uso</span>
            </button>
          </div>
        </div>
      </div>

      <AdminCMSModal />
      <BusinessPortalModal
        isOpen={isBusinessPortalOpen}
        onClose={closeBusinessPortal}
      />
      <ManualModal
        isOpen={isManualModalOpen}
        onClose={closeManualModal}
        initialTab={manualActiveTab}
      />
    </div>
  );
}
