import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Traduce con Google (sin clave) y, si falla, con MyMemory. Guarda todo en disco: cada frase se traduce una sola vez.
const FILE = path.join(process.cwd(), 'data', 'translate_cache.json');
let cache: Record<string, string> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function load(): Record<string, string> {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    cache = {};
  }
  return cache as Record<string, string>;
}

function save() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    try {
      fs.writeFileSync(FILE, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }, 1500);
}

async function viaGoogle(text: string, from: string, to: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${from}&tl=${to}&q=${encodeURIComponent(text)}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('google ' + r.status);
  const d = await r.json();
  const out = (d[0] as unknown[][]).map((p) => p[0]).join('');
  return { out, detected: typeof d[2] === 'string' ? (d[2] as string) : from };
}

async function viaMyMemory(text: string, from: string, to: string) {
  if (from === 'auto') throw new Error('sin auto');
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 450))}&langpair=${from}|${to}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('mymemory ' + r.status);
  const d = await r.json();
  const out = d?.responseData?.translatedText;
  if (typeof out !== 'string' || !out) throw new Error('vacio');
  return { out, detected: from };
}

async function one(text: string, from: string, to: string) {
  try {
    return await viaGoogle(text, from, to);
  } catch {
    try {
      return await viaMyMemory(text, from, to);
    } catch {
      return { out: text, detected: from };
    }
  }
}

export async function POST(req: NextRequest) {
  let body: { lang?: string; from?: string; texts?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad' }, { status: 400 });
  }
  const to = String(body.lang || '');
  const from = String(body.from || 'es');
  const ok = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,4})?$/;
  if (!ok.test(to) || !(from === 'auto' || ok.test(from))) return NextResponse.json({ error: 'lang' }, { status: 400 });
  const texts = Array.isArray(body.texts) ? body.texts : [];
  if (texts.length === 0 || texts.length > 60 || texts.some((t) => typeof t !== 'string' || t.length > 2000)) {
    return NextResponse.json({ error: 'texts' }, { status: 400 });
  }
  const c = load();
  const out: string[] = new Array(texts.length);
  let detected = from;
  const pending: number[] = [];
  texts.forEach((t, i) => {
    const hit = from !== 'auto' ? c[`${from}|${to}|${t}`] : undefined;
    if (hit !== undefined) out[i] = hit;
    else pending.push(i);
  });
  let next = 0;
  async function worker() {
    while (next < pending.length) {
      const i = pending[next++];
      const t = texts[i] as string;
      const r = await one(t, from, to);
      out[i] = r.out;
      if (i === 0) detected = r.detected;
      if (r.out !== t) c[`${from}|${to}|${t}`] = r.out;
    }
  }
  await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
  if (pending.length) save();
  return NextResponse.json({ out, detected });
}