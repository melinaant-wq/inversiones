'use client'

import { useState } from 'react'
import { MorphIcon, type IconName, ICONS } from '@/components/ui/morph-icon'

const ALL_ICONS = Object.keys(ICONS) as IconName[]

const GROUPS = [
  { label: 'Navegación', icons: ['menu', 'close'] as IconName[] },
  { label: 'Flechas', icons: ['arrow-right', 'arrow-left', 'arrow-up', 'arrow-down'] as IconName[] },
  { label: 'Chevrons', icons: ['chevron-right', 'chevron-left', 'chevron-up', 'chevron-down'] as IconName[] },
  { label: 'Acciones', icons: ['plus', 'minus', 'check'] as IconName[] },
]

export default function IconsPage() {
  const [active, setActive] = useState<IconName>('menu')

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-12 p-8">
      {/* Título */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">MorphIcon</h1>
        <p className="text-sm text-zinc-400">
          3 líneas SVG · Morfosis animada · Rotación para variantes direccionales
        </p>
      </div>

      {/* Ícono principal */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <MorphIcon
            icon={active}
            size={48}
            strokeWidth={2}
            color="white"
            duration={400}
            aria-label={active}
          />
        </div>
        <span className="text-xs text-zinc-500 font-mono">{active}</span>
      </div>

      {/* Botones agrupados */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        {GROUPS.map(({ label, icons }) => (
          <div key={label}>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">{label}</p>
            <div className="flex gap-2 flex-wrap">
              {icons.map((name) => (
                <button
                  key={name}
                  onClick={() => setActive(name)}
                  className={[
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    active === name
                      ? 'bg-white text-zinc-950'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800',
                  ].join(' ')}
                >
                  <MorphIcon
                    icon={name}
                    size={16}
                    strokeWidth={2}
                    color={active === name ? 'black' : 'currentColor'}
                    duration={0}
                  />
                  <span className="font-mono">{name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Demo: secuencia rápida */}
      <QuickCycle />
    </main>
  )
}

function QuickCycle() {
  const sequence: IconName[] = ['menu', 'close', 'check', 'plus', 'minus', 'arrow-right', 'chevron-down']
  const [idx, setIdx] = useState(0)

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-zinc-500 uppercase tracking-widest">Ciclo rápido</p>
      <button
        onClick={() => setIdx((i) => (i + 1) % sequence.length)}
        className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center justify-center"
        aria-label="Siguiente ícono"
      >
        <MorphIcon
          icon={sequence[idx]}
          size={32}
          strokeWidth={2}
          color="white"
          duration={350}
        />
      </button>
      <span className="text-xs text-zinc-600 font-mono">{sequence[idx]}</span>
    </div>
  )
}
