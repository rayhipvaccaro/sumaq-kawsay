'use client';

import { useState } from 'react';
import { QrCode, Play, Pause, Headphones, Smartphone, Volume2 } from 'lucide-react';

interface QRAudioGuidesProps {
  lang: 'es' | 'en';
}

interface AudioTrack {
  id: string;
  zone: string;
  titleEs: string;
  titleEn: string;
  duration: string;
  narratorEs: string;
  narratorEn: string;
  summaryEs: string;
  summaryEn: string;
}

const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    zone: 'Hanan Pacha',
    titleEs: '01. Las Constelaciones Oscuras y los Apus de Ollantaytambo',
    titleEn: '01. Dark Cloud Constellations & the Mountain Spirits',
    duration: '4:20 min',
    narratorEs: 'Narrado por Don Feliciano (Paqo Quechua)',
    narratorEn: 'Narrated by Don Feliciano (Quechua Elder)',
    summaryEs: 'Descubre cómo los astrónomos incas leían en el río celestial Mayu (la Vía Láctea) la silueta de Yacana y predecían las temporadas de siembra y cosecha.',
    summaryEn: 'Discover how Inca skywatchers observed the cosmic river Mayu (Milky Way) to track sacred animals and calibrate the Andean planting calendar.'
  },
  {
    id: 'track-2',
    zone: 'Willka Unu',
    titleEs: '02. El Canto del Agua y el Baño de Vapor Sagrado',
    titleEn: '02. The Song of Water & Sacred Herbal Steam',
    duration: '3:45 min',
    narratorEs: 'Narrado por Doña Asunta (Curandera Andina)',
    narratorEn: 'Narrated by Doña Asunta (Andean Healer)',
    summaryEs: 'La memoria viva de las fuentes ceremoniales y el uso ancestral de la muña silvestre en el Sauna Inca para equilibrar el cuerpo y el espíritu.',
    summaryEn: 'The living spirit of ceremonial stone springs and the time-honored practice of inhaling wild muña steam to align body and soul.'
  },
  {
    id: 'track-3',
    zone: 'Inti Punku',
    titleEs: '03. Las Canteras de Kachiqhata y las Piedras Cansadas',
    titleEn: '03. The Megalithic Quarries of Kachiqhata',
    duration: '5:10 min',
    narratorEs: 'Narrado por Prof. Javier (Arqueólogo del Valle)',
    narratorEn: 'Narrated by Prof. Javier (Valley Archaeologist)',
    summaryEs: 'La asombrosa ingeniería con la que los antiguos peruanos transportaban bloques de granito de 50 toneladas a través del cañón del Urubamba.',
    summaryEn: 'The astonishing engineering feats used by Inca stone masons to maneuver 50-ton megaliths across the Urubamba river canyon.'
  }
];

export function QRAudioGuides({ lang }: QRAudioGuidesProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const isEs = lang === 'es';

  const togglePlay = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="audioguias" className="py-24 bg-[#181513] text-stone-100 border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Large Fonts */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#221E1B] border border-[#F6A935] text-sm sm:text-base font-bold uppercase tracking-widest text-[#FDE8B5] mb-4 shadow-md">
            <QrCode className="w-5 h-5 text-[#F6A935]" />
            <span>{isEs ? 'Tecnología Cultural · Inka Lab' : 'Cultural Technology · Inka Lab'}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
            {isEs ? 'QR Turístico & Audioguías Ancestrales' : 'QR Tourism & Ancestral Audio Guides'}
          </h2>
          <p className="mt-4 text-lg sm:text-2xl text-stone-200 leading-relaxed font-normal">
            {isEs
              ? 'En cada rincón de nuestro complejo en el Km 84 encontrarás códigos QR que activan relatos sonoros grabados por sabios locales y arqueólogos en tu propio teléfono.'
              : 'Throughout our sanctuary at Km 84, QR stations unlock immersive audio storytelling narrated by native elders and archaeologists directly on your smartphone.'}
          </p>
        </div>

        {/* 2-Column interactive audio player simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: QR Pass Graphic card (4 Cols) */}
          <div className="lg:col-span-4 bg-[#221E1B] p-8 rounded-3xl border-2 border-[#F6A935] text-center flex flex-col items-center justify-center shadow-2xl">
            <div className="w-52 h-52 rounded-2xl bg-white p-4 shadow-xl mb-6 flex items-center justify-center border-4 border-[#F6A935]">
              {/* Scalable clean QR representation */}
              <div className="w-full h-full border-2 border-[#181513] rounded-lg p-2.5 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-[#181513] rounded-sm flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#181513]" />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#181513] rounded-sm flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#181513]" />
                    </div>
                  </div>
                </div>
                <div className="text-center font-heading font-extrabold text-xs text-[#181513] tracking-widest">
                  INKALAB · AUDIO
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 bg-[#181513] rounded-sm flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#181513]" />
                    </div>
                  </div>
                  <Smartphone className="w-6 h-6 text-[#181513]" />
                </div>
              </div>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white mb-2">
              {isEs ? 'Pase Digital Inka Lab' : 'Inka Lab Digital Pass'}
            </h3>
            <p className="text-sm sm:text-base text-stone-300 font-normal max-w-xs leading-relaxed">
              {isEs
                ? 'Acceso sin papel, ecológico y disponible sin conexión en tu dispositivo móvil al llegar a Ollantaytambo.'
                : '100% paperless, eco-friendly digital access available offline on your phone upon arrival.'}
            </p>
          </div>

          {/* Right Column: Audio Tracks List (8 Cols) with Large Fonts */}
          <div className="lg:col-span-8 space-y-5">
            {AUDIO_TRACKS.map((track) => {
              const isPlaying = playingId === track.id;

              return (
                <div
                  key={track.id}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all shadow-lg ${
                    isPlaying
                      ? 'bg-[#221E1B] border-[#F6A935] ring-2 ring-[#F6A935]/50 shadow-2xl'
                      : 'bg-[#221E1B]/70 border-stone-700 hover:bg-[#221E1B] hover:border-[#F6A935]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-5 min-w-0">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => togglePlay(track.id)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-md transform hover:scale-105 ${
                          isPlaying
                            ? 'bg-[#F6A935] text-[#181513]'
                            : 'bg-stone-800 hover:bg-[#F6A935] hover:text-[#181513] text-white border border-[#F6A935]/40'
                        }`}
                        aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Track info */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#181513] bg-[#F6A935] px-3 py-1 rounded-md">
                            {track.zone}
                          </span>
                          <span className="text-[#F6A935] font-bold">·</span>
                          <span className="text-sm sm:text-base text-[#FDE8B5] font-mono font-bold tabular-nums">
                            {track.duration}
                          </span>
                        </div>
                        <h4 className="font-heading text-lg sm:text-2xl font-extrabold text-white mt-1">
                          {isEs ? track.titleEs : track.titleEn}
                        </h4>
                        <span className="text-sm sm:text-base text-[#FDE8B5] italic block mt-1 font-medium">
                          {isEs ? track.narratorEs : track.narratorEn}
                        </span>
                        <p className="text-base sm:text-lg text-stone-200 mt-2.5 leading-relaxed font-normal">
                          {isEs ? track.summaryEs : track.summaryEn}
                        </p>
                      </div>
                    </div>

                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="hidden sm:flex items-center gap-1.5 text-[#F6A935] shrink-0 text-sm font-bold bg-[#181513] px-3 py-1.5 rounded-lg border border-[#F6A935]">
                        <Volume2 className="w-5 h-5 animate-pulse" />
                        <span className="font-mono">{isEs ? 'Reproduciendo' : 'Playing'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm sm:text-base text-stone-300">
              <span className="flex items-center gap-2 font-medium">
                <Headphones className="w-5 h-5 text-[#F6A935]" />
                <span>{isEs ? 'Compatible con audífonos Bluetooth y modo sin conexión' : 'Compatible with Bluetooth headphones & offline playback'}</span>
              </span>
              <span className="text-[#FDE8B5] font-mono font-bold">INKALAB-AUDIO-GUIDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
