// Idiomas del sitio. Espanol e ingles estan escritos a mano.
// Para sumar otros idiomas con traduccion automatica se agregan aqui (ver nota en SitePrefs).

export type SiteLang = 'es' | 'en';

export const SITE_LANGS: { code: SiteLang; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

export const LANG_KEY = 'sumaq_lang_v1';
export const CURRENCY_KEY = 'sumaq_currency_v1';
