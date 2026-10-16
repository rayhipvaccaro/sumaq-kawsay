'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';
import { answer, type BotAction } from '@/lib/chatEngine'; import { useSiteData } from '@/lib/siteData';

// Textos de la ventana en español; se traducen solos al idioma elegido en el sitio.
const UI_ES = [
  'Asistente Sumaq Kawsay', // 0
  'Escribe tu pregunta…', // 1
  'Enviar', // 2
  '¡Hola! Soy el asistente de Sumaq Kawsay. Pregúntame por experiencias, hospedaje, clima, cómo llegar o reservas, en el idioma que quieras.', // 3
  '¿Qué experiencias tienen?', // 4
  '¿Cómo llego?', // 5
  '¿Cuál es la mejor temporada?', // 6
  'Quiero reservar', // 7
  'Descargar tríptico', // 8
  'Reservar ahora', // 9
  'Seguir mi reserva', // 10
  'Escribir por WhatsApp', // 11
  'Descargar tríptico', // 12
  'Escribiendo…', // 13
  'Cerrar', // 14
  'Abrir asistente', // 15
];
const ACTION_LABEL: Record<BotAction, number> = { reservar: 9, seguimiento: 10, whatsapp: 11, triptico: 12 };
const WA = 'https://wa.me/51912189856';

interface Msg {
  from: 'me' | 'bot';
  text: string;
  actions?: BotAction[];
}

async function translateText(text: string, to: string, from: string): Promise<{ text: string; detected: string }> {
  const parts = text.split('\n');
  const idx: number[] = [];
  parts.forEach((p, i) => {
    if (p.trim()) idx.push(i);
  });
  let detected = from === 'auto' ? 'es' : from;
  const out = [...parts];
  for (let i = 0; i < idx.length; i += 50) {
    const slice = idx.slice(i, i + 50);
    try {
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: to, from, texts: slice.map((k) => parts[k]) }),
      });
      const d = await r.json();
      if (!r.ok || !Array.isArray(d.out)) throw new Error('fallo');
      slice.forEach((k, j) => {
        if (typeof d.out[j] === 'string') out[k] = d.out[j];
      });
      if (i === 0 && typeof d.detected === 'string') detected = d.detected;
    } catch {
      // se queda con el texto original
    }
  }
  return { text: out.join('\n'), detected };
}

export function ChatBot() {
  const { uiLang } = useSitePrefs();
  const { tours, openBookingWizard, openOrderTracker } = useCMS(); const siteData = useSiteData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState<{ lang: string; arr: string[] } | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const ui = uiLang !== 'es' && tx && tx.lang === uiLang ? tx.arr : UI_ES;

  useEffect(() => {
    if (uiLang === 'es') return;
    let dead = false;
    translateText(UI_ES.join('\n'), uiLang, 'es').then((r) => {
      const arr = r.text.split('\n');
      if (!dead && arr.length === UI_ES.length) setTx({ lang: uiLang, arr });
    });
    return () => {
      dead = true;
    };
  }, [uiLang]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy, open]);

  const send = async (raw: string, shown?: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput('');
    setMessages((m) => [...m, { from: 'me', text: shown ?? text }]);
    let es = text;
    let target = uiLang;
    if (!shown) {
      const d = await translateText(text, 'es', 'auto');
      es = d.text;
      target = d.detected;
    }
    if (!/^[a-zA-Z]{2,3}(-[a-zA-Z]{2,4})?$/.test(target)) target = 'es';
    const rep = answer(es, tours, siteData);
    let out = rep.text;
    if (target !== 'es') out = (await translateText(rep.text, target, 'es')).text;
    setMessages((m) => [...m, { from: 'bot', text: out, actions: rep.actions }]);
    setBusy(false);
  };

  const run = (a: BotAction) => {
    if (a === 'reservar') openBookingWizard();
    else if (a === 'seguimiento') openOrderTracker();
    else if (a === 'whatsapp') window.open(WA, '_blank', 'noopener,noreferrer');
    else window.open('/triptico?auto=1', '_blank', 'noopener,noreferrer');
  };

  const chips = [4, 5, 6, 7, 8];

  return (
    <div data-notranslate className="fixed bottom-4 left-4 z-40">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={ui[15]}
          title={ui[15]}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#F6A935] bg-[#181513] text-[#F6A935] shadow-2xl transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      ) : (
        <section
          aria-label={ui[0]}
          className="flex h-128 max-h-[75vh] w-88 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border-2 border-[#F6A935] bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#181513] px-4 py-3 text-white">
            <h2 className="text-sm font-extrabold">{ui[0]}</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label={ui[14]} className="rounded p-1 hover:text-[#F6A935]">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FDFBF7] p-3 text-sm text-stone-900">
            <p dir="auto" className="max-w-[90%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white p-3 shadow">
              {ui[3]}
            </p>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => send(UI_ES[i], ui[i])}
                    className="rounded-full border border-[#F6A935] bg-white px-3 py-1.5 text-xs font-bold text-[#8A5A00] hover:bg-[#FFF7E6]"
                  >
                    {ui[i]}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex flex-col items-start gap-2'}>
                <p
                  dir="auto"
                  className={`max-w-[90%] whitespace-pre-line rounded-2xl p-3 ${
                    m.from === 'me' ? 'rounded-tr-sm bg-[#F6A935] font-semibold text-[#181513]' : 'rounded-tl-sm bg-white shadow'
                  }`}
                >
                  {m.text}
                </p>
                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => run(a)}
                        className="rounded-xl bg-[#181513] px-3 py-2 text-xs font-bold text-[#F6A935] hover:bg-black"
                      >
                        {ui[ACTION_LABEL[a]]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && <p className="text-xs text-stone-500">{ui[13]}</p>}
            <div ref={bottom} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex gap-2 border-t border-stone-200 bg-white p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ui[1]}
              dir="auto"
              className="min-w-0 flex-1 rounded-xl border-2 border-stone-300 px-3 py-2 text-sm focus:border-[#F6A935] focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label={ui[2]}
              className="rounded-xl bg-[#F6A935] px-3 text-[#181513] disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}