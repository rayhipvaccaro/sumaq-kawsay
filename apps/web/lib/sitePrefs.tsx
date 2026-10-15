'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { CURRENCY_KEY, LANG_KEY, type SiteLang } from '@/lib/languages';
import { hasRate, setMoneyRates } from '@/lib/money';

interface SitePrefs {
  lang: SiteLang;
  setLang: (l: SiteLang) => void;
  currency: string;
  setCurrency: (c: string) => void;
  /** Sube cuando llegan tipos de cambio nuevos, para que los precios se vuelvan a dibujar. */
  ratesRev: number;
  fxSource: 'live' | 'default';
  fxUpdatedAt: string | null;
}

const Ctx = createContext<SitePrefs | null>(null);

// Almacen pequeno sobre localStorage. useSyncExternalStore usa el valor por defecto en el servidor
// y en la hidratacion, y despues pasa al valor guardado, sin errores de hidratacion.
const listeners = new Set<() => void>();
const memory: Record<string, string> = {};

function readPref(key: string): string | null {
  if (key in memory) return memory[key];
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePref(key: string, value: string) {
  memory[key] = value;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
  listeners.forEach((f) => f());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
}

const snapLang = (): SiteLang => (readPref(LANG_KEY) === 'en' ? 'en' : 'es');
const snapCurrency = (): string => {
  const c = readPref(CURRENCY_KEY);
  return c && /^[A-Z]{3}$/.test(c) ? c : 'PEN';
};

export function SitePrefsProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, snapLang, () => 'es' as SiteLang);
  const currency = useSyncExternalStore(subscribe, snapCurrency, () => 'PEN');
  const [ratesRev, setRatesRev] = useState(0);
  const [fxSource, setFxSource] = useState<'live' | 'default'>('default');
  const [fxUpdatedAt, setFxUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/fx')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.rates) return;
        setMoneyRates(d.rates as Record<string, number>);
        setFxSource(d.source === 'live' ? 'live' : 'default');
        setFxUpdatedAt(typeof d.updatedAt === 'string' ? d.updatedAt : null);
        setRatesRev((n) => n + 1);
      })
      .catch(() => {
        // se queda con los de respaldo
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback((l: SiteLang) => writePref(LANG_KEY, l), []);
  const setCurrency = useCallback((c: string) => writePref(CURRENCY_KEY, hasRate(c) ? c : 'PEN'), []);

  const value = useMemo(
    () => ({ lang, setLang, currency, setCurrency, ratesRev, fxSource, fxUpdatedAt }),
    [lang, setLang, currency, setCurrency, ratesRev, fxSource, fxUpdatedAt],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSitePrefs(): SitePrefs {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSitePrefs debe usarse dentro de SitePrefsProvider');
  return v;
}
