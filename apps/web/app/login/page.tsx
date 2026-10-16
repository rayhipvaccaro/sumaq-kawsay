'use client';

import { useState } from 'react';
import Link from 'next/link';
import { homeFor } from '@/lib/permissions';
import { Lock, ArrowLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react';

type Mode = 'login' | 'change' | 'noadmin';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border-2 border-stone-700 bg-[#221E1B] text-white focus:outline-none focus:border-[#D4AF37] placeholder-stone-500';
const BUTTON_CLASS =
  'w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B38F24] text-[#181513] font-bold disabled:opacity-60 transition-all';

function safeNext(): string {
  const n = new URLSearchParams(window.location.search).get('next') || '/admin';
  return n.startsWith('/') && !n.startsWith('//') ? n : '/admin';
}

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
        className={`${INPUT_CLASS} pr-12`}
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
        title={show ? 'Ocultar clave' : 'Mostrar clave'}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#D4AF37] transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const finish = (user: { isAdmin: boolean; permissions?: string[] }) => {
    const next = new URLSearchParams(window.location.search).get('next');
    const target = next && next.startsWith('/') && !next.startsWith('//') ? next : homeFor(user);
    window.location.href = target;
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
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
      setError('Sin conexion con el servidor');
    } finally {
      setBusy(false);
    }
  };

  const onChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 10) {
      setError('La clave nueva debe tener minimo 10 caracteres');
      return;
    }
    if (newPassword !== confirm) {
      setError('Las claves nuevas no coinciden');
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
        setError(data?.error ?? 'No se pudo cambiar la clave');
        return;
      }
      setPassword('');
      setNewPassword('');
      setConfirm('');
      finish(data.user);
    } catch {
      setError('Sin conexion con el servidor');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMode('login');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#181513] text-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#F3E5AB]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio</span>
        </Link>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#221E1B] border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {mode === 'change' ? 'Crea tu clave nueva' : 'Acceso al panel'}
          </h1>
          <p className="text-sm text-stone-300">
            {mode === 'login' && 'Entra con tu usuario y clave.'}
            {mode === 'change' && 'Tu clave es temporal. Debes cambiarla para continuar.'}
            {mode === 'noadmin' &&
              'Tu cuenta no tiene panel de administracion.'}
          </p>
        </div>

        {mode === 'login' && (
          <form onSubmit={onLogin} className="space-y-4">
            <input
              className={INPUT_CLASS}
              placeholder="Usuario"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <PasswordField
              value={password}
              onChange={setPassword}
              placeholder="Clave"
              autoComplete="current-password"
            />
            <button className={BUTTON_CLASS} disabled={busy}>
              {busy ? 'Entrando...' : 'Entrar'}
            </button>
            <p className="text-xs text-stone-400 text-center leading-relaxed">
              ¿Olvidaste tu clave? Pide a un administrador que la restablezca. Te dará una clave temporal y
              la cambiarás al entrar.
            </p>
          </form>
        )}

        {mode === 'change' && (
          <form onSubmit={onChange} className="space-y-4">
            <PasswordField
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Clave nueva (minimo 10)"
              autoComplete="new-password"
            />
            <PasswordField
              value={confirm}
              onChange={setConfirm}
              placeholder="Repite la clave nueva"
              autoComplete="new-password"
            />
            <button className={BUTTON_CLASS} disabled={busy}>
              {busy ? 'Guardando...' : 'Guardar y entrar'}
            </button>
          </form>
        )}

        {mode === 'noadmin' && (
          <button onClick={logout} className={BUTTON_CLASS}>
            Cerrar sesion
          </button>
        )}

        {error && (
          <p className="text-red-400 text-sm flex items-center justify-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
}