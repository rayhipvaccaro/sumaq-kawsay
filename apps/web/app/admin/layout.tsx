'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FileText, MessageSquareQuote, Inbox, CalendarCheck,
  Wallet, Receipt, Boxes, MapPin, Users, ShieldCheck, Globe, LogOut, Menu, X,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface Item { href: string; label: string; icon: React.ReactNode; show: boolean }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sessionUser, can, logoutAdmin } = useCMS();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const admin = Boolean(sessionUser?.isAdmin);
  const ic = 'w-4 h-4 shrink-0';

  const groups: { title: string; items: Item[] }[] = [
    { title: '', items: [{ href: '/admin', label: 'Inicio', icon: <LayoutDashboard className={ic} />, show: true }] },
    {
      title: 'Contenido del sitio',
      items: [
        { href: '/admin/cms/tours', label: 'Paquetes y experiencias', icon: <Package className={ic} />, show: can('cms.edit') },
        { href: '/admin/cms/content', label: 'Textos y fotos del sitio', icon: <FileText className={ic} />, show: can('cms.edit') },
        { href: '/admin/cms/testimonials', label: 'Testimonios', icon: <MessageSquareQuote className={ic} />, show: can('cms.edit') },
      ],
    },
    {
      title: 'Ventas',
      items: [
        { href: '/admin/reservas', label: 'Reservas y cotizaciones', icon: <CalendarCheck className={ic} />, show: can('orders.view') || can('payments.manage') },
        { href: '/admin/cms/contacts', label: 'Contactos y consultas', icon: <Inbox className={ic} />, show: can('leads.view') },
      ],
    },
    {
      title: 'Finanzas',
      items: [
        { href: '/admin/finanzas/ventas', label: 'Libro de ventas', icon: <Receipt className={ic} />, show: can('payments.manage') },
        { href: '/admin/finanzas', label: 'Pagos y proveedores', icon: <Wallet className={ic} />, show: can('payments.manage') },
      ],
    },
    {
      title: 'Operación',
      items: [
        { href: '/admin/mi-area', label: 'Mi área: horarios y reservas', icon: <MapPin className={ic} />, show: can('area.manage') },
        { href: '/admin/operacion', label: 'Stock y proveedores', icon: <Boxes className={ic} />, show: admin },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { href: '/admin/usuarios', label: 'Usuarios y permisos', icon: <Users className={ic} />, show: admin },
        { href: '/admin/cms/settings', label: 'Seguridad y respaldos', icon: <ShieldCheck className={ic} />, show: admin },
      ],
    },
  ];

  const nav = (
    <nav className="flex-1 overflow-y-auto py-4 space-y-5">
      {groups.map((g) => {
        const items = g.items.filter((i) => i.show);
        if (!items.length) return null;
        return (
          <div key={g.title || 'home'}>
            {g.title && <div className="px-5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">{g.title}</div>}
            {items.map((i) => {
              const active = i.href === '/admin' || i.href === '/admin/finanzas' ? path === i.href : path.startsWith(i.href);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className={`mx-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active ? 'bg-[#F6A935] text-[#181513]' : 'text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {i.icon}
                  <span>{i.label}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );

  const side = (
    <div className="flex flex-col h-full bg-[#181513] text-stone-100">
      <div className="px-5 py-5 border-b border-stone-800">
        <div className="text-[#F6A935] font-extrabold text-lg leading-tight">Sumaq Kawsay</div>
        <div className="text-xs text-stone-400">Panel de administración</div>
      </div>
      {nav}
      <div className="p-4 border-t border-stone-800 space-y-2">
        {sessionUser && (
          <div className="text-xs text-stone-300">
            <div className="font-bold text-white">{sessionUser.fullName || sessionUser.username}</div>
            <div>{sessionUser.role}{sessionUser.area ? ` · ${sessionUser.area}` : ''}</div>
          </div>
        )}
        <div className="flex gap-2">
          <Link href="/" className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold">
            <Globe className="w-3.5 h-3.5" /> Ver sitio
          </Link>
          <button onClick={logoutAdmin} className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold">
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F1EA] text-stone-900 lg:flex">
      <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen print:hidden">{side}</aside>

      <div className="lg:hidden print:hidden flex items-center justify-between bg-[#181513] text-white px-4 py-3 sticky top-0 z-30">
        <span className="font-extrabold text-[#F6A935]">Sumaq Kawsay · Panel</span>
        <button onClick={() => setOpen(true)} aria-label="Abrir menú" className="p-1"><Menu className="w-6 h-6" /></button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 max-w-[85%] h-full">{side}</div>
          <button className="flex-1 bg-black/60" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X className="w-6 h-6 text-white m-3" /></button>
        </div>
      )}

      <main className="flex-1 min-w-0 p-4 sm:p-8">
        {!sessionUser ? <p className="text-stone-600">Cargando…</p> : children}
      </main>
    </div>
  );
}
