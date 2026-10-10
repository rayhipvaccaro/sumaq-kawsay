'use client';

interface ChacanaDividerProps {
  className?: string;
  repeat?: number;
}

export function ChacanaDivider({ className = '', repeat = 12 }: ChacanaDividerProps) {
  // Stepped Andean cross (Chacana) with inner hollow circle
  const renderChacana = (color: string, key: number) => (
    <svg
      key={key}
      viewBox="0 0 40 40"
      className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110"
      style={{ color }}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 2h12v6h6v6h6v12h-6v6h-6v6H14v-6H8v-6H2V14h6V8h6V2zm6 12a6 6 0 100 12 6 6 0 000-12z"
      />
    </svg>
  );

  return (
    <div
      className={`w-full overflow-hidden py-4 flex items-center justify-center gap-2.5 sm:gap-3.5 select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: repeat }).map((_, idx) => (
        <span key={idx} className="inline-flex">
          {renderChacana(idx % 2 === 0 ? '#9E2021' : '#F6A935', idx)}
        </span>
      ))}
    </div>
  );
}
