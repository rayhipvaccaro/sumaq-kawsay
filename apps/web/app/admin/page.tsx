'use client';

import Link from 'next/link';
import { Package, FileText, MessageSquareQuote, Inbox, CalendarCheck, Wallet, Boxes, MapPin, Users, ShieldCheck } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { PageHeader } from '@/components/admin/PageHeader';

export default function AdminHome() {
  const { sessionUser, can } = useCMS();
  const admin = Boolean(sessionUser?.isAdmin);
  const ic = 'w-6 h-6 text-[#B7791F]';
  const tiles = [
    { href: '/admin/cms/tours', t: 'Paquetes y experiencias', d: 'Crea y edita lo que vendes: precios, fotos y descripción.', i: <Package className={ic} />, s: can('cms.edit') },
    { href: '/admin/cms/content', t: 'Textos y fotos del sitio', d: 'Cambia los textos de la página principal.', i: <FileText className={ic} />, s: can('cms.edit') },
    { href: '/admin/cms/testimonials', t: 'Testimonios', d: 'Opiniones de turistas que se muestran en el sitio.', i: <MessageSquareQuote className={ic} />, s: can('cms.edit') },
    { href: '/admin/reservas', t: 'Reservas y cotizaciones', d: 'Clientes que reservaron o pidieron precio. Concreta o declina ventas.', i: <CalendarCheck className={ic} />, s: can('orders.view') || can('payments.manage') },
    { href: '/admin/cms/contacts', t: 'Contactos y consultas', d: 'Mensajes de visitantes del sitio.', i: <Inbox className={ic} />, s: can('leads.view') },
    { href: '/admin/finanzas', t: 'Pagos y contabilidad', d: 'Ingresos, comprobantes, IGV y deudas con proveedores.', i: <Wallet className={ic} />, s: can('payments.manage') },
    { href: '/admin/mi-area', t: 'Mi área', d: 'Agrega horarios y mira las reservas de tu servicio.', i: <MapPin className={ic} />, s: can('area.manage') },
    { href: '/admin/operacion', t: 'Stock y proveedores', d: 'Inventario por área y proveedores.', i: <Boxes className={ic} />, s: admin },
    { href: '/admin/usuarios', t: 'Usuarios y permisos', d: 'Crea cuentas, reinicia claves y define qué puede hacer cada rol.', i: <Users className={ic} />, s: admin },
    { href: '/admin/cms/settings', t: 'Seguridad y respaldos', d: 'Respaldo y restauración de datos.', i: <ShieldCheck className={ic} />, s: admin },
  ].filter((x) => x.s);

  return (
    <>
      <PageHeader
        title={`Hola, ${sessionUser?.fullName || sessionUser?.username}`}
        help={`Entraste como ${sessionUser?.role}. Estas son las secciones que puedes usar.`}
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tiles.map((x) => (
          <Link key={x.href} href={x.href} className="bg-white border border-stone-300 hover:border-[#F6A935] hover:shadow-md rounded-xl p-5 transition-all">
            <div className="flex items-center gap-3 mb-2">{x.i}<h2 className="font-bold text-stone-900">{x.t}</h2></div>
            <p className="text-sm text-stone-600">{x.d}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
