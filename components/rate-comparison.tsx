"use client"

import { ChevronRight } from "lucide-react"

export function RateComparison({ onSarsClick }: { onSarsClick?: () => void }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      <p className="text-base font-bold text-foreground text-balance">
        {"Con sARS tu tasa rinde mas."}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {/* Lemon */}
        <div className="flex aspect-square items-end rounded-2xl bg-accent-lime p-3.5">
          <div>
            <p className="text-xs font-bold text-accent-lime-foreground/70">Lemon</p>
            <p className="mt-1 text-xl font-bold leading-none tracking-tight text-accent-lime-foreground">
              29,5%
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-accent-lime-foreground/50">TNA</p>
          </div>
        </div>

        {/* Billeteras virtuales */}
        <div className="flex aspect-square items-end rounded-2xl bg-secondary p-3.5">
          <div>
            <p className="text-[10px] font-medium leading-tight text-muted-foreground">
              Billeteras virtuales
            </p>
            <p className="mt-1 text-xl font-bold leading-none tracking-tight text-foreground">~22%</p>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground/50">TNA prom.</p>
          </div>
        </div>

        {/* Bancos tradicionales */}
        <div className="flex aspect-square items-end rounded-2xl bg-secondary p-3.5">
          <div>
            <p className="text-[10px] font-medium leading-tight text-muted-foreground">
              Bancos tradicionales
            </p>
            <p className="mt-1 text-xl font-bold leading-none tracking-tight text-foreground">~18%</p>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground/50">TNA prom.</p>
          </div>
        </div>
      </div>

      <button
        onClick={onSarsClick}
        className="mt-4 flex w-full items-center justify-center gap-1 rounded-full border border-border py-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground active:bg-secondary"
      >
        {"Saber mas"}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
