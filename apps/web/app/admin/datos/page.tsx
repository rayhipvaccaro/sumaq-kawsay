'use client';

import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { DEFAULT_SITE_DATA, useSiteData, type SiteDataLists } from '@/lib/siteData';

type Kind = 'text' | 'area' | 'number' | 'list';
interface FDef {
  k: string;
  label: string;
  kind: Kind;
}
type Tab = keyof SiteDataLists;
type Item = Record<string, unknown>;

const pair = (k: string, label: string, kind: Kind): FDef[] => [
  { k: k + 'Es', label: label + ' (ES)', kind },
  { k: k + 'En', label: label + ' (EN)', kind },
];

const SCHEMAS: Record<Tab, { label: string; titleKey: string; hasId: boolean; fields: FDef[] }> = {
  seasons: {
    label: 'Temporadas y clima',
    titleKey: 'nameEs',
    hasId: true,
    fields: [
      ...pair('name', 'Nombre', 'text'),
      ...pair('months', 'Meses', 'text'),
      ...pair('verdict', 'Recomendación', 'area'),
      ...pair('weather', 'Clima', 'area'),
      ...pair('scenery', 'Paisaje', 'area'),
      ...pair('clothingTips', 'Qué llevar (uno por línea)', 'list'),
    ],
  },
  zones: {
    label: 'Zonas sagradas',
    titleKey: 'nameEs',
    hasId: true,
    fields: [
      { k: 'pacha', label: 'Pacha', kind: 'text' },
      ...pair('name', 'Nombre', 'text'),
      ...pair('symbolism', 'Simbolismo', 'text'),
      { k: 'altitude', label: 'Altitud', kind: 'text' },
      ...pair('difficulty', 'Dificultad', 'text'),
      ...pair('duration', 'Duración', 'text'),
      { k: 'pricePEN', label: 'Precio en soles (S/)', kind: 'number' },
      { k: 'priceUSD', label: 'Precio en dólares (US$)', kind: 'number' },
      { k: 'image', label: 'Foto (ruta, ej. /images/inkalab/astronomia.jpeg)', kind: 'text' },
      ...pair('description', 'Descripción', 'area'),
      ...pair('highlights', 'Puntos destacados (uno por línea)', 'list'),
      ...pair('cosmovision', 'Cosmovisión', 'area'),
    ],
  },
  services: {
    label: 'Hospedaje y servicios',
    titleKey: 'titleEs',
    hasId: true,
    fields: [
      ...pair('title', 'Nombre', 'text'),
      ...pair('tagline', 'Frase corta', 'text'),
      ...pair('description', 'Descripción', 'area'),
      { k: 'image', label: 'Foto (ruta)', kind: 'text' },
      ...pair('features', 'Características (una por línea)', 'list'),
      { k: 'priceNotePEN', label: 'Precio en soles (texto, ej. Desde S/ 380 / noche)', kind: 'text' },
      { k: 'priceNoteUSD', label: 'Precio en dólares (texto)', kind: 'text' },
    ],
  },
  reach: {
    label: 'Cómo llegar',
    titleKey: 'from',
    hasId: false,
    fields: [
      { k: 'from', label: 'Desde', kind: 'text' },
      { k: 'distance', label: 'Distancia', kind: 'text' },
      { k: 'time', label: 'Tiempo', kind: 'text' },
      { k: 'route', label: 'Ruta', kind: 'text' },
      ...pair('recommendations', 'Recomendaciones', 'area'),
    ],
  },
};

const F =
  'w-full rounded-lg border-2 border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-[#F6A935] focus:outline-none';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">{label}</span>
      {children}
    </label>
  );
}

function blank(tab: Tab): Item {
  const s = SCHEMAS[tab];
  const o: Item = {};
  if (s.hasId) o.id = `n-${Date.now()}`;
  for (const f of s.fields) o[f.k] = f.kind === 'number' ? 0 : f.kind === 'list' ? [] : '';
  return o;
}

function Editor() {
  const { updateSiteData } = useCMS();
  const current = useSiteData();
  const [lists, setLists] = useState<SiteDataLists>(current);
  const [tab, setTab] = useState<Tab>('seasons');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const schema = SCHEMAS[tab];
  const items = lists[tab] as unknown as Item[];
  const setItems = (n: Item[]) => setLists((l) => ({ ...l, [tab]: n as never }));
  const setField = (i: number, k: string, v: unknown) => setItems(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };

  const save = async () => {
    setBusy(true);
    setMsg('Guardando…');
    const clean = (arr: Item[]) =>
      arr.map((it) => {
        const o: Item = { ...it };
        for (const k of Object.keys(o)) {
          if (Array.isArray(o[k])) o[k] = (o[k] as string[]).map((x) => x.trim()).filter(Boolean);
        }
        return o;
      });
    const out = {
      seasons: lists.seasons.length ? clean(lists.seasons as unknown as Item[]) : DEFAULT_SITE_DATA.seasons,
      zones: lists.zones.length ? clean(lists.zones as unknown as Item[]) : DEFAULT_SITE_DATA.zones,
      services: lists.services.length ? clean(lists.services as unknown as Item[]) : DEFAULT_SITE_DATA.services,
      reach: lists.reach.length ? clean(lists.reach as unknown as Item[]) : DEFAULT_SITE_DATA.reach,
    } as SiteDataLists;
    const ok = await updateSiteData(out);
    setMsg(ok ? 'Guardado. Ya se ve en el sitio, el tríptico y el chatbot.' : 'No se pudo guardar. Revisa tu sesión e inténtalo otra vez.');
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SCHEMAS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === t ? 'bg-[#F6A935] text-[#181513]' : 'bg-white text-stone-800 hover:bg-stone-100'}`}
          >
            {SCHEMAS[t].label}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">{schema.label}</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => setItems([...items, blank(tab)])} className="inline-flex items-center gap-1.5 rounded-lg bg-[#181513] px-3 py-2 text-sm font-bold text-[#F6A935]">
              <Plus className="h-4 w-4" /> Agregar
            </button>
            <button
              type="button"
              onClick={() => setLists((l) => ({ ...l, [tab]: DEFAULT_SITE_DATA[tab] as never }))}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100"
            >
              <RotateCcw className="h-4 w-4" /> Volver a los originales
            </button>
          </div>
        </div>

        {items.length === 0 && <p className="text-sm text-stone-500">Sin elementos: al guardar se usarán los originales.</p>}

        {items.map((it, i) => (
          <details key={String(it.id ?? i)} className="rounded-xl border-2 border-stone-200 p-4">
            <summary className="cursor-pointer text-sm font-extrabold">{String(it[schema.titleKey] || 'Nuevo elemento')}</summary>
            <div className="mt-4 space-y-3">
              <div className="flex justify-end gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Subir" className="rounded p-1.5 hover:bg-stone-100"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Bajar" className="rounded p-1.5 hover:bg-stone-100"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="Quitar" className="rounded p-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {schema.fields.map((f) => (
                  <Field key={f.k} label={f.label}>
                    {f.kind === 'area' ? (
                      <textarea className={F} rows={4} value={String(it[f.k] ?? '')} onChange={(e) => setField(i, f.k, e.target.value)} />
                    ) : f.kind === 'list' ? (
                      <textarea className={F} rows={4} value={((it[f.k] as string[]) ?? []).join('\n')} onChange={(e) => setField(i, f.k, e.target.value.split('\n'))} />
                    ) : f.kind === 'number' ? (
                      <input className={F} type="number" value={Number(it[f.k] ?? 0)} onChange={(e) => setField(i, f.k, Number(e.target.value) || 0)} />
                    ) : (
                      <input className={F} value={String(it[f.k] ?? '')} onChange={(e) => setField(i, f.k, e.target.value)} />
                    )}
                  </Field>
                ))}
              </div>
            </div>
          </details>
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
          <button type="button" onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#F6A935] px-5 py-3 text-sm font-extrabold text-[#181513] disabled:opacity-60">
            <Save className="h-4 w-4" /> Guardar cambios
          </button>
          {msg && <span className="text-sm font-semibold text-stone-700">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

export default function DatosAdminPage() {
  const { isLoading } = useCMS();
  return (
    <>
      <PageHeader
        title="Temporadas, zonas y servicios"
        help="Edita las tarjetas que se muestran en Clima y temporadas, Zonas sagradas, Servicios y tarifas y Cómo llegar. Lo que cambies sale también en el tríptico y en el chatbot."
      />
      {isLoading ? <p className="text-stone-600">Cargando…</p> : <Editor />}
    </>
  );
}