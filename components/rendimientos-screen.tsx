"use client"

import { useCallback, useState } from "react"
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react"
import { MonthlyEarningsChart, periodLabels, type Period } from "@/components/monthly-earnings-chart"
import { RateComparison } from "@/components/rate-comparison"

export default function RendimientosScreen({
  onBack,
  onFaq,
  onSars,
  onProtocolos,
}: {
  onBack: () => void
  onFaq: () => void
  onSars: () => void
  onProtocolos: () => void
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [period, setPeriod] = useState<Period>("mes")
  const [accumulatedTotal, setAccumulatedTotal] = useState(0)
  const [accumulatedLabel, setAccumulatedLabel] = useState("Ultimos 12 meses")

  const handlePeriodChange = useCallback((total: number, label: string) => {
    setAccumulatedTotal(total)
    setAccumulatedLabel(label)
  }, [])

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-bold text-foreground">Rendimientos</h1>
          <button
            onClick={onFaq}
            aria-label="Preguntas frecuentes"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Rate Comparison */}
      <section className="mt-4 px-5">
        <RateComparison onSarsClick={onSars} />
      </section>

      {/* Earnings Card */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia acumulada</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                ${accumulatedTotal.toLocaleString("es-AR")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{accumulatedLabel}</p>
            </div>
            <div className="relative mt-1">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="appearance-none rounded-full border border-border bg-secondary py-1.5 pl-3.5 pr-8 text-xs font-semibold text-foreground outline-none transition-colors hover:border-foreground/20 focus:border-foreground/30"
              >
                {(Object.keys(periodLabels) as Period[]).map((p) => (
                  <option key={p} value={p}>
                    {periodLabels[p]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <MonthlyEarningsChart period={period} onPeriodChange={handlePeriodChange} />
          </div>
        </div>
      </section>

      {/* Cambiar protocolo */}
      <section className="mt-4 px-5">
        <button
          onClick={onProtocolos}
          className="flex w-full items-center justify-between rounded-2xl bg-card p-4 shadow-sm transition-colors active:bg-secondary"
        >
          <span className="text-sm font-semibold text-foreground">Configurar protocolo</span>
          <span className="text-xs text-muted-foreground">AAVE v3 · 10,2% TEA</span>
        </button>
      </section>

      {/* Deactivate */}
      <section className="mt-6 px-5 pb-4">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex w-full items-center justify-center rounded-full border border-destructive/30 py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 hover:border-destructive/50"
          >
            Desactivar rendimientos
          </button>
        ) : (
          <div className="rounded-2xl border border-destructive/20 bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{"Estas seguro?"}</p>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Si desactivas los rendimientos, tu dinero dejara de generar ganancias. Podes volver
              a activarlos en cualquier momento.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition-colors active:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full bg-destructive py-3 text-sm font-semibold text-destructive-foreground transition-colors active:opacity-90"
              >
                Desactivar
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="pb-6" />
    </main>
  )
}
