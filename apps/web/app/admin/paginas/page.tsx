'use client';

import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { PAGE_LIST, type PageBlock, type PageContent } from '@/data/pagesContent';

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

function Editor({ initial }: { initial: Record<string, PageContent> }) {
  const { updatePages } = useCMS();
  const [pages, setPages] = useState<Record<string, PageContent>>(initial);
  const [sel, setSel] = useState(PAGE_LIST[0].key);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const def = PAGE_LIST.find((p) => p.key === sel) ?? PAGE_LIST[0];
  const cur: PageContent = pages[sel] ?? {};
  const blocks = cur.blocks ?? [];

  const patch = (p: Partial<PageContent>) => setPages((all) => ({ ...all, [sel]: { ...(all[sel] ?? {}), ...p } }));
  const setBlock = (i: number, p: Partial<PageBlock>) => patch({ blocks: blocks.map((b, k) => (k === i ? { ...b, ...p } : b)) });
  const addBlock = () =>
    patch({ blocks: [...blocks, { id: `b-${Date.now()}`, titleEs: '', titleEn: '', bodyEs: '', bodyEn: '', image: '' }] });
  const delBlock = (i: number) => patch({ blocks: blocks.filter((_, k) => k !== i) });
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= blocks.length) return;
    const n = [...blocks];
    [n[i], n[j]] = [n[j], n[i]];
    patch({ blocks: n });
  };
  const reset = () =>
    setPages((all) => {
      const n = { ...all };
      delete n[sel];
      return n;
    });

  const save = async () => {
    setBusy(true);
    setMsg('Guardando…');
    const ok = await updatePages(pages);
    setMsg(ok ? 'Guardado. Ya se ve en el sitio.' : 'No se pudo guardar. Revisa tu sesión e inténtalo otra vez.');
    setBusy(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
      <nav className="flex flex-wrap gap-2 lg:flex-col" aria-label="Páginas">
        {PAGE_LIST.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setSel(p.key)}
            className={`rounded-lg px-3 py-2 text-left text-sm font-bold ${
              sel === p.key ? 'bg-[#F6A935] text-[#181513]' : 'bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            {p.label}
            {(pages[p.key]?.blocks?.length || pages[p.key]?.titleEs || pages[p.key]?.titleEn) ? ' ✎' : ''}
          </button>
        ))}
      </nav>

      <div className="space-y-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">{def.label}</h2>
          <a href={`/${sel}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8A5A00] underline">
            Ver la página <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <section className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-500">Cabecera de la página</h3>
          <p className="text-xs text-stone-500">Si dejas un campo vacío, se usa el texto original (el que ves en gris).</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Etiqueta superior (ES)">
              <input className={F} value={cur.eyebrowEs ?? ''} placeholder={def.eyebrow[0]} onChange={(e) => patch({ eyebrowEs: e.target.value })} />
            </Field>
            <Field label="Etiqueta superior (EN)">
              <input className={F} value={cur.eyebrowEn ?? ''} placeholder={def.eyebrow[1]} onChange={(e) => patch({ eyebrowEn: e.target.value })} />
            </Field>
            <Field label="Título (ES)">
              <input className={F} value={cur.titleEs ?? ''} placeholder={def.title[0]} onChange={(e) => patch({ titleEs: e.target.value })} />
            </Field>
            <Field label="Título (EN)">
              <input className={F} value={cur.titleEn ?? ''} placeholder={def.title[1]} onChange={(e) => patch({ titleEn: e.target.value })} />
            </Field>
            <Field label="Subtítulo (ES)">
              <textarea className={F} rows={2} value={cur.subtitleEs ?? ''} placeholder={def.subtitle[0]} onChange={(e) => patch({ subtitleEs: e.target.value })} />
            </Field>
            <Field label="Subtítulo (EN)">
              <textarea className={F} rows={2} value={cur.subtitleEn ?? ''} placeholder={def.subtitle[1]} onChange={(e) => patch({ subtitleEn: e.target.value })} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-500">Bloques de texto al final de la página</h3>
            <button type="button" onClick={addBlock} className="inline-flex items-center gap-1.5 rounded-lg bg-[#181513] px-3 py-2 text-sm font-bold text-[#F6A935]">
              <Plus className="h-4 w-4" /> Agregar bloque
            </button>
          </div>
          {blocks.length === 0 && <p className="text-sm text-stone-500">Esta página no tiene bloques extra.</p>}
          {blocks.map((b, i) => (
            <div key={b.id} className="space-y-3 rounded-xl border-2 border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <strong className="text-sm">Bloque {i + 1}</strong>
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} aria-label="Subir" className="rounded p-1.5 hover:bg-stone-100"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Bajar" className="rounded p-1.5 hover:bg-stone-100"><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => delBlock(i)} aria-label="Quitar bloque" className="rounded p-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Título (ES)"><input className={F} value={b.titleEs} onChange={(e) => setBlock(i, { titleEs: e.target.value })} /></Field>
                <Field label="Título (EN)"><input className={F} value={b.titleEn} onChange={(e) => setBlock(i, { titleEn: e.target.value })} /></Field>
                <Field label="Texto (ES)"><textarea className={F} rows={5} value={b.bodyEs} onChange={(e) => setBlock(i, { bodyEs: e.target.value })} /></Field>
                <Field label="Texto (EN)"><textarea className={F} rows={5} value={b.bodyEn} onChange={(e) => setBlock(i, { bodyEn: e.target.value })} /></Field>
              </div>
              <Field label="Foto (ruta, ej. /images/inkalab/laguna-nevada.png)">
                <input className={F} value={b.image ?? ''} onChange={(e) => setBlock(i, { image: e.target.value })} />
              </Field>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
          <button type="button" onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#F6A935] px-5 py-3 text-sm font-extrabold text-[#181513] disabled:opacity-60">
            <Save className="h-4 w-4" /> Guardar cambios
          </button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border-2 border-stone-300 px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-100">
            <RotateCcw className="h-4 w-4" /> Volver al texto original de esta página
          </button>
          {msg && <span className="text-sm font-semibold text-stone-700">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

export default function PaginasAdminPage() {
  const { cmsRawData, isLoading } = useCMS();
  return (
    <>
      <PageHeader
        title="Páginas del sitio"
        help="Cambia el título y el subtítulo de cada página, y agrega bloques de texto con foto al final. Lo que escribas en español e inglés se traduce solo a los demás idiomas."
      />
      {isLoading ? <p className="text-stone-600">Cargando…</p> : <Editor initial={cmsRawData.pages ?? {}} />}
    </>
  );
}