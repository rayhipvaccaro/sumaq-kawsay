'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, AlertTriangle } from 'lucide-react';

type Mode = 'login' | 'change' | 'noadmin';

function safeNext(): string {
  const n = new URLSearchParams(window.location.search).get('next') || '/admin';
  return n.startsWith('/') && !n.startsWith('//') ? n : '/admin';
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const finish = (user: { isAdmin: boolean }) => {
    if (user?.isAdmin) {
      window.location.href = safeNext();
    } else {
      setMode('noadmin');
    }
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

  const input =
    'w-full px-4 py-3 rounded-xl border-2 border-stone-700 bg-[#221E1B] text-white focus:outline-none focus:border-[#D4AF37] placeholder-stone-500';
  const button =
    'w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B38F24] text-[#181513] font-bold disabled:opacity-60 transition-all';

  return (
    <div className="min-h-screen bg-[#181513] text-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#F3E5AB]">
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
            {mode === 'noadmin' && 'Tu cuenta no es de administrador. Tu panel de encargado se habilita pronto.'}
          </p>
        </div>

        {mode === 'login' && (
          <form onSubmit={onLogin} className="space-y-4">
            <input className={input} placeholder="Usuario" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input className={input} type="password" placeholder="Clave" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className={button} disabled={busy}>{busy ? 'Entrando...' : 'Entrar'}</button>
          </form>
        )}

        {mode === 'change' && (
          <form onSubmit={onChange} className="space-y-4">
            <input className={input} type="password" placeholder="Clave nueva (minimo 10)" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <input className={input} type="password" placeholder="Repite la clave nueva" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <button className={button} disabled={busy}>{busy ? 'Guardando...' : 'Guardar y entrar'}</button>
          </form>
        )}

        {mode === 'noadmin' && (
          <button onClick={logout} className={button}>Cerrar sesion</button>
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