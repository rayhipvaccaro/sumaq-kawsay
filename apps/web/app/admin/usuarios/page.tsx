'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';

interface Role { id: number; name: string; isAdmin: boolean; permissions: string[] }
interface Perm { code: string; label: string }
interface Area { id: number; name: string }
interface UserRow {
  id: number; username: string; fullName: string; active: boolean;
  area: { id: number; name: string } | null;
  role: Role; lockedUntil: string | null;
}

const INPUT = 'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm placeholder-stone-500 focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';
const BTN = 'px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm disabled:opacity-60';
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

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [perms, setPerms] = useState<Perm[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [msg, setMsg] = useState('');
  const [temp, setTemp] = useState<{ username: string; pass: string } | null>(null);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleId, setRoleId] = useState<number>(0);
  const [areaId, setAreaId] = useState<number>(0);
  const [newArea, setNewArea] = useState('');
  const [newRole, setNewRole] = useState('');

  const load = useCallback(async () => {
    try {
      const [u, r, p, a] = await Promise.all([api('users'), api('roles'), api('permissions'), api('areas')]);
      setUsers(u); setRoles(r); setPerms(p); setAreas(a);
      setRoleId((cur) => cur || (r.find((x: Role) => !x.isAdmin)?.id ?? 0));
    } catch (e) {
      setMsg((e as Error).message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<void>) => {
    setMsg('');
    try { await fn(); await load(); } catch (e) { setMsg((e as Error).message); }
  };

  const selRole = roles.find((r) => r.id === roleId);
  const needsArea = selRole?.permissions.includes('area.manage');

  return (
    <div>
      <div className="max-w-5xl space-y-8">
        <PageHeader title="Usuarios y permisos" help="Crea cuentas para tu equipo, reinicia claves y define qué puede hacer cada rol. La clave temporal se muestra una sola vez." />
        {msg && <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-sm">{msg}</div>}
        {temp && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-400 text-emerald-900 text-sm space-y-1">
            <div>Clave temporal de <b>{temp.username}</b> (se muestra una sola vez):</div>
            <code className="text-lg font-mono select-all">{temp.pass}</code>
            <div><button className={BTN2} onClick={() => setTemp(null)}>Ya la copié</button></div>
          </div>
        )}

        <section className="space-y-3 bg-white border border-stone-300 rounded-xl p-4">
          <h2 className="font-bold text-lg text-stone-900">Crear usuario</h2>
          <div className="flex flex-wrap gap-2">
            <input className={INPUT} placeholder="usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className={INPUT} placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <select className={INPUT} value={roleId} onChange={(e) => setRoleId(Number(e.target.value))}>
              {roles.filter((r) => !r.isAdmin).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {needsArea && (
              <select className={INPUT} value={areaId} onChange={(e) => setAreaId(Number(e.target.value))}>
                <option value={0}>— área —</option>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
            <button
              className={BTN}
              onClick={() => run(async () => {
                const r = await api('users', 'POST', { username, fullName, roleId, ...(needsArea && areaId ? { areaId } : {}) });
                setTemp({ username: r.user.username, pass: r.tempPassword });
                setUsername(''); setFullName('');
              })}
            >Crear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <input className={INPUT} placeholder="Nueva área (ej. Caballos)" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
            <button className={BTN2} onClick={() => run(async () => { await api('areas', 'POST', { name: newArea }); setNewArea(''); })}>Crear área</button>
          </div>
        </section>

        <section className="space-y-2 bg-white border border-stone-300 rounded-xl p-4">
          <h2 className="font-bold text-lg text-stone-900">Usuarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-stone-600">
                <tr><th className="p-2">Usuario</th><th>Nombre</th><th>Rol</th><th>Área</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-stone-300">
                    <td className="p-2 font-mono">{u.username}</td>
                    <td>{u.fullName}</td>
                    <td>{u.role.name}</td>
                    <td>{u.area?.name ?? '—'}</td>
                    <td>{u.active ? 'Activo' : 'Inactivo'}</td>
                    <td className="space-x-1 whitespace-nowrap">
                      <button className={BTN2} onClick={() => run(async () => {
                        const r = await api(`users/${u.id}/reset-password`, 'POST');
                        setTemp({ username: r.username, pass: r.tempPassword });
                      })}>Reiniciar clave</button>
                      <button className={BTN2} onClick={() => run(async () => { await api(`users/${u.id}/active`, 'PATCH', { active: !u.active }); })}>
                        {u.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 bg-white border border-stone-300 rounded-xl p-4">
          <h2 className="font-bold text-lg text-stone-900">Permisos por rol</h2>
          {roles.map((r) => (
            <div key={r.id} className="p-3 rounded-lg border border-stone-300 bg-white">
              <div className="font-bold mb-2">{r.name}{r.isAdmin && <span className="text-xs text-stone-600"> · todos los permisos</span>}</div>
              {!r.isAdmin && (
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {perms.map((p) => {
                    const on = r.permissions.includes(p.code);
                    return (
                      <label key={p.code} className="text-xs flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={on} onChange={() => run(async () => {
                          const next = on ? r.permissions.filter((x) => x !== p.code) : [...r.permissions, p.code];
                          await api(`roles/${r.id}/permissions`, 'PATCH', { permissions: next });
                        })} />
                        {p.label}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <input className={INPUT} placeholder="Nuevo rol" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
            <button className={BTN2} onClick={() => run(async () => { await api('roles', 'POST', { name: newRole, permissions: [] }); setNewRole(''); })}>Crear rol</button>
          </div>
        </section>
      </div>
    </div>
  );
}
