"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, Info } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { ProjectionChart } from "@/components/projection-chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const RATE = 0.102

export default function UsdProyeccionScreen({
  onBack,
  principal = 900,
}: {
  onBack: () => void
  principal?: number
}) {
  const [monthlyAmount, setMonthlyAmount] = useState([100])

  const projections = useMemo(() => {
    const monthly = monthlyAmount[0]
    const monthlyRate = RATE / 12
    const years = 30
    const months = years * 12

    const principalGrowth = principal * Math.pow(1 + RATE, years)
    const contributionsGrowth =
      monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    const finalValue = principalGrowth + contributionsGrowth
    const totalDeposited = principal + monthly * months
    const earnings = finalValue - totalDeposited

    return {
      finalValue: Math.round(finalValue),
      earnings: Math.round(earnings),
    }
  }, [monthlyAmount, principal])

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-card no-scrollbar">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{"Simular proyeccion"}</h1>
        </div>
      </header>

      <section className="flex-1 px-5 pt-6">
        <TooltipProvider>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <p className="text-sm font-medium text-muted-foreground">10,2% anual</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-xs">
                  Esta proyeccion es estimativa. Los rendimientos reales pueden variar.
                </TooltipContent>
              </Tooltip>
            </div>

            <p className="mt-3 text-5xl font-bold tracking-tight text-foreground">
              ${projections.finalValue.toLocaleString("es-AR")}
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="bg-foreground px-2 py-0.5 text-sm font-bold text-accent-lime">
                ${projections.earnings.toLocaleString("es-AR")}
              </span>
              <span className="text-sm text-muted-foreground">generados en 30 anos</span>
            </div>
          </div>
        </TooltipProvider>

        <div className="mt-8">
          <ProjectionChart
            principal={principal}
            rate={RATE}
            years={30}
            monthlyContribution={monthlyAmount[0]}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            <span className="text-xs text-muted-foreground">Con rendimientos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground">Sin rendimientos</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-foreground">{"Deposito mensual"}</p>
            <p className="text-lg font-bold text-foreground">USD {monthlyAmount[0]}</p>
          </div>

          <div className="mt-4">
            <Slider
              value={monthlyAmount}
              onValueChange={setMonthlyAmount}
              min={0}
              max={1000}
              step={25}
              className="[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-border [&_[data-slot=slider-range]]:bg-foreground [&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-6 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-card [&_[data-slot=slider-thumb]]:bg-foreground"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>USD 0</span>
              <span>USD 1.000</span>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 bg-card px-5 pt-4 pb-8">
        <button className="w-full rounded-full bg-foreground py-4 text-sm font-semibold text-background transition-transform active:scale-[0.98]">
          Configurar compra automatica
        </button>
      </div>
    </main>
  )
}
