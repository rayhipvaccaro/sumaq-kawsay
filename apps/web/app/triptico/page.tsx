'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';
import { SITE_LANGS } from '@/lib/languages';
import { AutoTranslate } from '@/components/AutoTranslate';
import { useSiteData } from '@/lib/siteData';

const CSS = `
@page { size: A4 landscape; margin: 9mm; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.tri { font-family: Georgia, 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.35; color: #1C1917; }
.tri-sheet { max-width: 297mm; margin: 0 auto; background: #fff; padding: 9mm; }
.tri-cols { column-count: 3; column-gap: 9mm; column-rule: 1px solid #e7ddc8; }
.tri-card { break-inside: avoid; margin: 0 0 5mm; }
.tri-h2 { break-after: avoid; margin: 0 0 3mm; padding-bottom: 1.5mm; border-bottom: 2px solid #F6A935; font-size: 12pt; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #181513; }
.tri h3 { margin: 0 0 1mm; font-size: 11pt; font-weight: 800; color: #181513; }
.tri h4 { margin: 2mm 0 .5mm; font-size: 8pt; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: #8A5A00; }
.tri p { margin: 0 0 1.5mm; }
.tri ul { margin: 0; padding-left: 4mm; }
.tri li { margin: 0 0 .5mm; }
.tri-img { display: block; width: 100%; height: 30mm; object-fit: cover; border-radius: 2mm; margin-bottom: 2mm; }
.tri-meta { font-size: 8pt; font-weight: 700; color: #8A5A00; margin-bottom: 1.5mm; }
.tri-cover { background: #181513; color: #fff; padding: 6mm; border-radius: 3mm; }
.tri-cover h1 { margin: 0 0 2mm; font-size: 20pt; line-height: 1.1; color: #F6A935; }
.tri-cover p { color: #f5efe3; }
.tri-bar { position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; background: #181513; color: #fff; padding: 10px 16px; font-family: system-ui, sans-serif; font-size: 14px; }
.tri-bar select, .tri-bar button { border-radius: 10px; padding: 8px 12px; font-weight: 700; }
@media (max-width: 900px) { .tri-cols { column-count: 1; } }
@media print { .no-print { display: none !important; } .tri-sheet { padding: 0; max-width: none; } .tri-cols { column-count: 3 !important; } }
`;

export default function TripticoPage() {
  const { tours, isLoading } = useCMS();
  const { uiLang, setLang } = useSitePrefs(); const siteData = useSiteData();
  const en = uiLang === 'en';
  const T = (es: string, enT: string) => (en ? enT : es);
  const L = (es?: string, enS?: string) => (en ? enS || es || '' : es || '');
  const A = (es?: string[], enA?: string[]): string[] => (en && enA && enA.length ? enA : es) ?? [];

  // Con ?auto=1 abre la ventana de impresión (guardar como PDF) cuando todo está cargado y traducido.
  useEffect(() => {
    if (isLoading) return;
    if (new URLSearchParams(window.location.search).get('auto') !== '1') return;
    let done = false;
    let quiet: ReturnType<typeof setTimeout>;
    const ready = () => !document.body.dataset.translating && Array.from(document.images).every((i) => i.complete);
    const go = () => {
      if (done) return;
      if (!ready()) {
        quiet = setTimeout(go, 800);
        return;
      }
      done = true;
      mo.disconnect();
      window.print();
    };
    const mo = new MutationObserver(() => {
      clearTimeout(quiet);
      quiet = setTimeout(go, 2500);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    quiet = setTimeout(go, 2500);
    const max = setTimeout(() => {
      if (done) return;
      done = true;
      mo.disconnect();
      window.print();
    }, 40000);
    return () => {
      done = true;
      mo.disconnect();
      clearTimeout(quiet);
      clearTimeout(max);
    };
  }, [isLoading]);

  const Bullets = ({ items }: { items: string[] }) =>
    items.length ? (
      <ul>
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    ) : null;

  return (
    <div className="tri">
      <style>{CSS}</style>
      <AutoTranslate />

      <div className="tri-bar no-print">
        <strong>{T('Tríptico Sumaq Kawsay', 'Sumaq Kawsay brochure')}</strong>
        <select value={uiLang} onChange={(e) => setLang(e.target.value)} aria-label="Idioma / Language" style={{ color: '#181513' }}>
          {SITE_LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => window.print()} style={{ background: '#F6A935', color: '#181513' }}>
          <Download size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: '-3px' }} />
          {T('Descargar PDF', 'Download PDF')}
        </button>
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          {T('En la ventana que se abre elige "Guardar como PDF".', 'In the window that opens, choose "Save as PDF".')}
        </span>
      </div>

      <main className="tri-sheet">
        <div className="tri-cols">
          <section className="tri-card tri-cover">
            <h1>SUMAQ KAWSAY</h1>
            <p style={{ fontWeight: 700 }}>Inka Lab · Km 84, Ollantaytambo · Valle Sagrado, Cusco</p>
            <p>
              {T(
                'Donde la sabiduría de los Andes sigue viva. Turismo sostenible, etnobotánica viva y experiencias vivenciales con guías locales.',
                'Where the wisdom of the Andes is still alive. Sustainable tourism, living ethnobotany and hands-on experiences with local guides.',
              )}
            </p>
          </section>

          <h2 className="tri-h2">{T('Experiencias y paquetes', 'Experiences & packages')}</h2>
          {tours.map((t) => (
            <article key={t.id} className="tri-card">
              {t.image && <img className="tri-img" src={t.image} alt="" />}
              <h3>{L(t.titleEs, t.titleEn)}</h3>
              <p className="tri-meta">
                {[L(t.locationEs, t.locationEn), L(t.durationEs, t.durationEn), L(t.difficultyEs, t.difficultyEn), t.maxAltitude, t.groupSize]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <p>{L(t.subtitleEs, t.subtitleEn)}</p>
              <p>{L(t.descriptionEs, t.descriptionEn)}</p>
              <Bullets items={A(t.highlightsEs, t.highlightsEn)} />
              {(t.itinerary ?? []).length > 0 && (
                <>
                  <h4>{T('Itinerario', 'Itinerary')}</h4>
                  <ul>
                    {t.itinerary.map((i, k) => (
                      <li key={k}>
                        <strong>{i.time}</strong> — {L(i.titleEs, i.titleEn)}. {L(i.descEs, i.descEn)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {A(t.includedEs, t.includedEn).length > 0 && (
                <>
                  <h4>{T('Incluye', 'Included')}</h4>
                  <Bullets items={A(t.includedEs, t.includedEn)} />
                </>
              )}
              {A(t.notIncludedEs, t.notIncludedEn).length > 0 && (
                <>
                  <h4>{T('No incluye', 'Not included')}</h4>
                  <Bullets items={A(t.notIncludedEs, t.notIncludedEn)} />
                </>
              )}
              {A(t.whatToBringEs, t.whatToBringEn).length > 0 && (
                <>
                  <h4>{T('Qué llevar', 'What to bring')}</h4>
                  <Bullets items={A(t.whatToBringEs, t.whatToBringEn)} />
                </>
              )}
            </article>
          ))}

          <h2 className="tri-h2">{T('Zonas ancestrales de Inka Lab', 'Ancestral zones at Inka Lab')}</h2>
          {siteData.zones.map((z) => (
            <article key={z.id} className="tri-card">
              {z.image && <img className="tri-img" src={z.image} alt="" />}
              <h3>{L(z.nameEs, z.nameEn)}</h3>
              <p className="tri-meta">
                {[z.pacha, L(z.durationEs, z.durationEn), L(z.difficultyEs, z.difficultyEn), z.altitude].filter(Boolean).join(' · ')}
              </p>
              <p>{L(z.symbolismEs, z.symbolismEn)}</p>
              <p>{L(z.descriptionEs, z.descriptionEn)}</p>
              <Bullets items={A(z.highlightsEs, z.highlightsEn)} />
              <p>{L(z.cosmovisionEs, z.cosmovisionEn)}</p>
            </article>
          ))}

          <h2 className="tri-h2">{T('Hospedaje y servicios', 'Lodging & services')}</h2>
          {siteData.services.map((s) => (
            <article key={s.id} className="tri-card">
              {s.image && <img className="tri-img" src={s.image} alt="" />}
              <h3>{L(s.titleEs, s.titleEn)}</h3>
              <p className="tri-meta">{L(s.taglineEs, s.taglineEn)}</p>
              <p>{L(s.descriptionEs, s.descriptionEn)}</p>
              <Bullets items={A(s.featuresEs, s.featuresEn)} />
            </article>
          ))}

          <h2 className="tri-h2">{T('Cuándo viajar', 'When to travel')}</h2>
          {siteData.seasons.map((s) => (
            <article key={s.id} className="tri-card">
              <h3>{L(s.nameEs, s.nameEn)}</h3>
              <p className="tri-meta">{L(s.monthsEs, s.monthsEn)}</p>
              <p>{L(s.weatherEs, s.weatherEn)}</p>
              <p>{L(s.sceneryEs, s.sceneryEn)}</p>
              <Bullets items={A(s.clothingTipsEs, s.clothingTipsEn)} />
            </article>
          ))}

          <h2 className="tri-h2">{T('Cómo llegar', 'How to get here')}</h2>
          {siteData.reach.map((h, i) => (
            <article key={i} className="tri-card">
              <h3>{h.from}</h3>
              <p className="tri-meta">
                {h.distance} · {h.time}
              </p>
              <p>{h.route}</p>
              <p>{L(h.recommendationsEs, h.recommendationsEn)}</p>
            </article>
          ))}

          <section className="tri-card tri-cover" data-notranslate>
            <h3 style={{ color: '#F6A935' }}>{T('Contacto', 'Contact')}</h3>
            <p>Inka Lab Complejo: Km 84, Ollantaytambo</p>
            <p>Sumaq Kawsay: Pampa del Castillo 455, Cusco</p>
            <p>WhatsApp: +51 930 924 560 (Inka Lab) · +51 912 189 856 (Sumaq Kawsay)</p>
            <p>info@sumaqkawsay.com</p>
          </section>
        </div>
      </main>
    </div>
  );
}