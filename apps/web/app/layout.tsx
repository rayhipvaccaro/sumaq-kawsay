import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CMSProvider } from '@/lib/cmsContext';
import { SitePrefsProvider } from '@/lib/sitePrefs';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#181513',
};

export const metadata: Metadata = {
  title: 'Sumaq Kawsay - InkaLab Cusco',
  description: 'Plataforma de turismo sostenible, etnobotánica ancestral y experiencias personalizadas en Cusco y el Valle Sagrado.',
  keywords: [
    'Sumaq Kawsay',
    'Inka Lab',
    'Turismo Sostenible Cusco',
    'Ollantaytambo Km 84',
    'Etnobotánica Andina',
    'Chillca',
    'Camino Inca',
    'Sauna Inca',
    'Valle Sagrado',
  ],
  authors: [{ name: 'Sumaq Kawsay Expeditions & Inka Lab' }],
  openGraph: {
    title: 'Sumaq Kawsay - InkaLab Cusco',
    description: 'Plataforma de turismo sostenible, etnobotánica ancestral y experiencias personalizadas en Cusco y el Valle Sagrado.',
    type: 'website',
    locale: 'es_PE',
    images: [
      {
        url: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
        width: 1200,
        height: 630,
        alt: 'Sumaq Kawsay Cusco - Valle Sagrado de los Incas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sumaq Kawsay - InkaLab Cusco',
    description: 'Plataforma de turismo sostenible, etnobotánica ancestral y experiencias personalizadas en Cusco y el Valle Sagrado.',
    images: ['/images/hero_valle_sagrado_andes_1791233029285.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristInformationCenter',
  name: 'Sumaq Kawsay - InkaLab Cusco',
  description: 'Plataforma de turismo sostenible, etnobotánica ancestral y experiencias personalizadas en Cusco y el Valle Sagrado.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Km 84 Vía Férrea Ollantaytambo',
    addressLocality: 'Ollantaytambo',
    addressRegion: 'Cusco',
    addressCountry: 'PE',
  },
  telephone: '+51912189856',
  email: 'contacto@sumaqkawsay.pe',
  currenciesAccepted: 'PEN, USD',
  paymentAccepted: 'Cash, Credit Card, Yape, Plin, Bank Transfer',
  priceRange: '$$',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#FDFBF7] text-[#1C1917] antialiased selection:bg-[#D4AF37]/30 selection:text-[#4A2E1B] overflow-x-hidden">
        <CMSProvider>
          <SitePrefsProvider>{children}</SitePrefsProvider>
        </CMSProvider>
      </body>
    </html>
  );
}

