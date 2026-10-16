'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { useCMS } from '@/lib/cmsContext';

interface Customer {
  id: number;
  username: string;
  fullName: string;
  docType: string | null;
  docNumber: string | null;
  discountPct: number;
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  role: { name: string };
}

const INPUT =
  'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm placeholder-stone-500 focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';
const BTN2 = 'px-2.5 py-1.5 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-400';

async function api(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`/api/nest/${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const m = Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? data?.error;
    throw new Error(m || 'Error');
  }
  return data;
}

export default function ClientesPage() {
  const { sessionUser } = useCMS();
  const admin = Boolean(sessionUser?.isAdmin);
  const [rows, setRows] = useState<Customer[]>([]);
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('todos');
  const [msg, setMsg] = useState('');
  const [temp, setTemp] = useState<{ username: string; pass: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await api('customers'));
    } catch (e) {
      setMsg((e as Error).message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<void>) => {
    setMsg('');
    try { await fn(); await load(); } catch (e) { setMsg((e as Error).message); }
  };

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows
      .filter((r) => kind === 'todos' || r.role.name === kind)
      .filter((r) => !t || [r.username, r.fullName, r.docNumber].some((x) => String(x ?? '').toLowerCase().includes(t)));
  }, [rows, q, kind]);

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Clientes y agencias"
        help="Cuentas que se crean solas cuando un turista reserva. Si alguien olvida su clave, restablécela aquí: vuelve a ser su número de documento."
      />
      {msg && <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-sm">{msg}</div>}
      {temp && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-400 text-emerald-900 text-sm space-y-1">
          <div>Nueva clave de <b>{temp.username}</b> (se muestra una sola vez; deberá cambiarla al entrar):</div>
          <code className="text-lg font-mono select-all">{temp.pass}</code>
          <div><button className={BTN2} onClick={() => setTemp(null)}>Ya la copié</button></div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 bg-white border border-stone-300 rounded-xl p-4">
        <input className={`${INPUT} w-64`} placeholder="Buscar correo, nombre o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={INPUT} value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="todos">Turistas y agencias</option>
          <option value="Turista">Solo turistas</option>
          <option value="Agencia">Solo agencias</option>
        </select>
      </div>

      <div className="bg-white border border-stone-300 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-stone-600 bg-stone-50">
            <tr>
              <th className="p-3">Correo / usuario</th><th>Nombre</th><th>Tipo</th><th>Documento</th>
              <th>Dscto.</th><th>Último ingreso</th><th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-stone-200">
                <td className="p-3 font-mono text-xs">{r.username}</td>
                <td>{r.fullName}</td>
                <td>{r.role.name}</td>
                <td className="whitespace-nowrap">{r.docNumber ? `${r.docType ?? ''} ${r.docNumber}` : '—'}</td>
                <td>
                  {r.role.name === 'Agencia' ? (
                    admin ? (
                      <button
                        className={BTN2}
                        onClick={() => {
                          const v = window.prompt(`Descuento fijo de ${r.fullName} (0 a 100 %)`, String(r.discountPct));
                          if (v === null) return;
                          run(async () => { await api(`users/${r.id}/discount`, 'PATCH', { discountPct: Number(v) }); });
                        }}
                      >
                        {r.discountPct}% · cambiar
                      </button>
                    ) : `${r.discountPct}%`
                  ) : '—'}
                </td>
                <td className="text-xs text-stone-600">
                  {r.lastLoginAt ? r.lastLoginAt.slice(0, 16).replace('T', ' ') : 'Nunca'}
                </td>
                <td className="whitespace-nowrap pr-3">
                  <button
                    className={BTN2}
                    onClick={() => {
                      if (!window.confirm(`¿Restablecer la clave de ${r.username}?`)) return;
                      run(async () => {
                        const x = await api(`customers/${r.id}/reset-password`, 'POST', {});
                        setTemp({ username: x.username, pass: x.tempPassword });
                      });
                    }}
                  >
                    Restablecer clave
                  </button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-stone-600">Aún no hay cuentas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
