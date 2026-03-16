'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Coordenadas de cada línea: [x1, y1, x2, y2]
type LC = [number, number, number, number]
type Lines = [LC, LC, LC]

interface IconDef {
  lines: Lines
  rotate: number
}

// Punto central del viewBox 24×24
const C = 12

// ─── Definición de íconos ────────────────────────────────────────────────────
//
// Reglas:
//   • Cada ícono tiene exactamente 3 líneas
//   • Líneas sobrantes colapsan al centro [C, C, C, C]
//   • Íconos que comparten forma (flechas, chevrons) usan la misma geometría
//     y se distinguen únicamente por `rotate`

const ICONS = {
  // 3 líneas horizontales
  menu: {
    lines: [
      [3, 6, 21, 6],
      [3, 12, 21, 12],
      [3, 18, 21, 18],
    ] as Lines,
    rotate: 0,
  },

  // 2 diagonales + línea colapsada
  close: {
    lines: [
      [6, 6, 18, 18],
      [18, 6, 6, 18],
      [C, C, C, C],
    ] as Lines,
    rotate: 0,
  },

  // ── Flechas: misma geometría, distintas rotaciones ────────────────────────
  'arrow-right': {
    lines: [
      [3, 12, 21, 12],  // tallo
      [13, 6, 21, 12],  // cabeza superior
      [13, 18, 21, 12], // cabeza inferior
    ] as Lines,
    rotate: 0,
  },
  'arrow-left': {
    lines: [
      [3, 12, 21, 12],
      [13, 6, 21, 12],
      [13, 18, 21, 12],
    ] as Lines,
    rotate: 180,
  },
  'arrow-up': {
    lines: [
      [3, 12, 21, 12],
      [13, 6, 21, 12],
      [13, 18, 21, 12],
    ] as Lines,
    rotate: -90,
  },
  'arrow-down': {
    lines: [
      [3, 12, 21, 12],
      [13, 6, 21, 12],
      [13, 18, 21, 12],
    ] as Lines,
    rotate: 90,
  },

  // ── Chevrons: misma geometría, distintas rotaciones ───────────────────────
  'chevron-right': {
    lines: [
      [10, 6, 18, 12],  // ángulo superior
      [10, 18, 18, 12], // ángulo inferior
      [C, C, C, C],
    ] as Lines,
    rotate: 0,
  },
  'chevron-left': {
    lines: [
      [10, 6, 18, 12],
      [10, 18, 18, 12],
      [C, C, C, C],
    ] as Lines,
    rotate: 180,
  },
  'chevron-up': {
    lines: [
      [10, 6, 18, 12],
      [10, 18, 18, 12],
      [C, C, C, C],
    ] as Lines,
    rotate: -90,
  },
  'chevron-down': {
    lines: [
      [10, 6, 18, 12],
      [10, 18, 18, 12],
      [C, C, C, C],
    ] as Lines,
    rotate: 90,
  },

  // Horizontal + vertical + colapsada
  plus: {
    lines: [
      [3, 12, 21, 12],
      [12, 3, 12, 21],
      [C, C, C, C],
    ] as Lines,
    rotate: 0,
  },

  // 1 horizontal + 2 colapsadas
  minus: {
    lines: [
      [3, 12, 21, 12],
      [C, C, C, C],
      [C, C, C, C],
    ] as Lines,
    rotate: 0,
  },

  // Checkmark: 2 segmentos + colapsada
  check: {
    lines: [
      [3, 12, 9, 18],
      [9, 18, 21, 5],
      [C, C, C, C],
    ] as Lines,
    rotate: 0,
  },
} satisfies Record<string, IconDef>

export type IconName = keyof typeof ICONS
export { ICONS }

// ─── Helpers de animación ─────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Rotación siempre por el camino más corto (≤ 180°)
function shortestRotation(from: number, to: number): number {
  const diff = ((to - from) % 360 + 540) % 360 - 180
  return from + diff
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MorphIconProps {
  icon: IconName
  size?: number
  strokeWidth?: number
  color?: string
  /** Duración de la transición en ms */
  duration?: number
  className?: string
  'aria-label'?: string
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function MorphIcon({
  icon,
  size = 24,
  strokeWidth = 2,
  color = 'currentColor',
  duration = 400,
  className,
  'aria-label': ariaLabel,
}: MorphIconProps) {
  const lineRefs = React.useRef<(SVGLineElement | null)[]>([null, null, null])
  const groupRef = React.useRef<SVGGElement>(null)

  // Estado animado actual: se actualiza en cada frame del RAF
  const animatedRef = React.useRef<{ lines: Lines; rotate: number }>({
    lines: ICONS[icon].lines,
    rotate: ICONS[icon].rotate,
  })

  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const target = ICONS[icon]
    const fromLines = animatedRef.current.lines
    const fromRotate = animatedRef.current.rotate
    const toLines = target.lines
    const toRotate = shortestRotation(fromRotate, target.rotate)

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    const start = performance.now()

    function tick(now: number) {
      const raw = Math.min((now - start) / duration, 1)
      const t = easeInOutCubic(raw)

      // Interpolar cada línea
      const interpolated = fromLines.map((fl, i) =>
        fl.map((v, j) => lerp(v, toLines[i][j], t)),
      ) as Lines

      lineRefs.current.forEach((el, i) => {
        if (!el) return
        el.setAttribute('x1', String(interpolated[i][0]))
        el.setAttribute('y1', String(interpolated[i][1]))
        el.setAttribute('x2', String(interpolated[i][2]))
        el.setAttribute('y2', String(interpolated[i][3]))
      })

      // Interpolar rotación
      const rot = lerp(fromRotate, toRotate, t)
      if (groupRef.current) {
        groupRef.current.style.transform = `rotate(${rot}deg)`
      }

      animatedRef.current = { lines: interpolated, rotate: rot }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        animatedRef.current = { lines: toLines, rotate: toRotate }
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [icon, duration])

  const init = ICONS[icon]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? 'img' : undefined}
    >
      <g
        ref={groupRef}
        style={{
          transform: `rotate(${init.rotate}deg)`,
          transformOrigin: '12px 12px',
        }}
      >
        {init.lines.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        ))}
      </g>
    </svg>
  )
}
