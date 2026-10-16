'use client';

import { useEffect } from 'react';
import { useSitePrefs } from '@/lib/sitePrefs';

const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'SELECT', 'OPTION']);
const originals = new Map<Text, string>();
const applied = new Map<Text, string>();
const memo = new Map<string, string>();

function textNodes(root: Node): Text[] {
  const out: Text[] = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = w.nextNode())) {
    const t = n as Text;
    const p = t.parentElement;
    if (!p || SKIP.has(p.tagName) || p.closest('[data-notranslate]')) continue;
    if (!/\p{L}/u.test(t.nodeValue || '')) continue;
    out.push(t);
  }
  return out;
}

async function fetchTr(lang: string, texts: string[]) {
  const need = Array.from(new Set(texts.filter((t) => !memo.has(lang + '|' + t))));
  for (let i = 0; i < need.length; i += 40) {
    const chunk = need.slice(i, i + 40);
    try {
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, texts: chunk }),
      });
      if (!r.ok) continue;
      const d = await r.json();
      chunk.forEach((t, j) => {
        if (typeof d.out?.[j] === 'string') memo.set(lang + '|' + t, d.out[j]);
      });
    } catch {
      // se queda en español
    }
  }
}

let inflight = 0; async function run(lang: string, cancelled: () => boolean) { inflight++; document.body.dataset.translating = '1'; try { await run0(lang, cancelled); } finally { inflight--; if (inflight <= 0) delete document.body.dataset.translating; } } async function run0(lang: string, cancelled: () => boolean) {
  const items: { node: Text; core: string; lead: string; trail: string }[] = [];
  for (const node of textNodes(document.body)) {
    const cur = node.nodeValue || '';
    let src = originals.get(node);
    if (src === undefined || applied.get(node) !== cur) {
      src = cur;
      originals.set(node, cur);
    }
    const core = src.trim();
    if (!core) continue;
    items.push({ node, core, lead: src.slice(0, src.indexOf(core)), trail: src.slice(src.indexOf(core) + core.length) });
  }
  await fetchTr(lang, items.map((i) => i.core));
  if (cancelled()) return;
  for (const { node, core, lead, trail } of items) {
    const tr = memo.get(lang + '|' + core);
    if (!tr) continue;
    const val = lead + tr + trail;
    if (node.nodeValue !== val) node.nodeValue = val;
    applied.set(node, val);
  }
}

export function AutoTranslate() {
  const { uiLang } = useSitePrefs();
  useEffect(() => {
    if (uiLang === 'es' || uiLang === 'en') {
      if (originals.size > 0) window.location.reload();
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      void run(uiLang, () => cancelled);
    };
    go();
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(go, 350);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      cancelled = true;
      mo.disconnect();
      clearTimeout(timer);
    };
  }, [uiLang]);
  return null;
}