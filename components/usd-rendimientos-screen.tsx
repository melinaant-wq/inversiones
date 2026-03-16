"use client"

import { ArrowLeft } from "lucide-react"
import { UsdMonthlyEarningsChart } from "@/components/usd-monthly-earnings-chart"

export default function UsdRendimientosScreen({
  onBack,
  onFaq,
  onProtocolos,
}: {
  onBack: () => void
  onFaq: () => void
  onProtocolos: () => void
}) {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background no-scrollbar">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Rendimientos</h1>
        </div>
      </header>

      {/* Earnings Card */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Ganancia acumulada</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">$117,70</p>
          <p className="mt-1 text-xs text-muted-foreground">Total desde el 1 Mar 2025</p>

          <div className="mt-5 border-t border-border pt-5">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Generado por mes</p>
            <UsdMonthlyEarningsChart />
          </div>
        </div>
      </section>

      {/* Investment Config Card */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Tu inversion actual</p>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-4xl font-bold tracking-tight text-foreground">10,2%</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Anual</p>

          <button
            onClick={onProtocolos}
            className="mt-5 flex w-full items-center justify-center rounded-full border border-border bg-card py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors active:bg-secondary"
          >
            Configura tu inversion
          </button>
        </div>
      </section>

      <div className="mt-auto flex flex-col items-center px-5 pt-10 pb-10">
        <button
          onClick={onFaq}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {"Quiero saber mas"}
        </button>
      </div>
    </main>
  )
}
