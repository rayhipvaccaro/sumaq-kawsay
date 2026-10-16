'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Eye, EyeOff, UserRound } from 'lucide-react';
import { homeFor } from '@/lib/permissions';

type Mode = 'login' | 'change';

const INPUT =
  'w-full px-4 py-3 rounded-xl border-2 border-stone-300 bg-white text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#F6A935]';
const BTN =
  'w-full py-3 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-black disabled:opacity-60 transition-colors';

function PasswordField({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        className={`${INPUT} pr-12`}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Ocultar clave' : 'Mostrar clave'}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-[#B7791F]"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

// Entrada de turistas y agencias (con correo). El equipo entra por /login.
export function IngresarView() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false);

  // Viene de una reserva: correo ya escrito y aviso de como crear la clave.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const e = q.get('email');
    const reserva = q.get('reserva');
    if (e) setEmail(e);
    if (reserva) {
      setBanner(
        q.get('nueva')
          ? `¡Reserva ${reserva} recibida! Creamos tu cuenta con ${e}. Escribe como clave tu número de documento (DNI o pasaporte) y enseguida crearás tu contraseña.`
          : `¡Reserva ${reserva} recibida! Entra con tu correo y tu clave para verla en Mis reservas.`,
      );
    }
  }, []);

  const finish = (user: { isAdmin: boolean; permissions?: string[]; role?: string }) => {
    const next = new URLSearchParams(window.location.search).get('next');
    window.location.href =
      next && next.startsWith('/') && !next.startsWith('//') ? next : homeFor(user);
  };

  const onLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'No se pudo entrar');
        return;
      }
      if (data.mustChangePassword) {
        setMode('change');
        return;
      }
      finish(data.user);
    } catch {
      setError('Sin conexión con el servidor');
    } finally {
      setBusy(false);
    }
  };

  const onChange = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    if (newPassword.length < 10) {
      setError('La contraseña nueva debe tener mínimo 10 caracteres');
      return;
    }
    if (newPassword !== confirm) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: password, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'No se pudo cambiar la contraseña');
        return;
      }
      finish(data.user);
    } catch {
      setError('Sin conexión con el servidor');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-h-[80vh] bg-[#FDFBF7] px-4 pb-16 pt-36 text-[#1C1917] sm:pt-40">
      <div className="mx-auto w-full max-w-md space-y-5 rounded-3xl border-2 border-[#F6A935]/50 bg-white p-6 shadow-xl sm:p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#F6A935] bg-[#FFF7E6] text-[#B7791F]">
            <UserRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold">
            {mode === 'change' ? 'Crea tu contraseña' : 'Ingresar a mi cuenta'}
          </h1>
          <p className="text-sm text-stone-600">
            {mode === 'login'
              ? 'Entra con el correo de tu reserva. Si es tu primera vez, tu clave es tu número de documento (DNI o pasaporte).'
              : 'Tu clave inicial es temporal. Crea una contraseña nueva para continuar.'}
          </p>
        </div>

        {mode === 'login' && banner && (
          <p className="rounded-xl border border-emerald-400 bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-900">
            {banner}
          </p>
        )}

        {mode === 'login' ? (
          <form onSubmit={onLogin} className="space-y-4">
            <input
              className={INPUT}
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordField
              value={password}
              onChange={setPassword}
              placeholder="Clave (tu documento si es la primera vez)"
              autoComplete="current-password"
            />
            <button className={BTN} disabled={busy}>
              {busy ? 'Entrando…' : 'Entrar'}
            </button>
            <p className="text-center text-xs leading-relaxed text-stone-500">
              ¿Olvidaste tu clave? Escríbenos y Ventas la restablecerá: volverá a ser tu número de documento.
            </p>
          </form>
        ) : (
          <form onSubmit={onChange} className="space-y-4">
            <PasswordField
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Contraseña nueva (mínimo 10)"
              autoComplete="new-password"
            />
            <PasswordField
              value={confirm}
              onChange={setConfirm}
              placeholder="Repite la contraseña nueva"
              autoComplete="new-password"
            />
            <button className={BTN} disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar y entrar'}
            </button>
          </form>
        )}

        {error && (
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}

        <p className="border-t border-stone-200 pt-3 text-center text-xs text-stone-500">
          ¿Eres del equipo?{' '}
          <Link href="/login" className="font-bold text-[#8A5A00] underline">
            Acceso al panel
          </Link>
        </p>
      </div>
    </section>
  );
}
