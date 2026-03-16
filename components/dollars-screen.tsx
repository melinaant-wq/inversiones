"use client"

import { useMemo } from "react"
import { ArrowLeft, ChevronRight, Download, ShoppingCart, Banknote, Send, Info } from "lucide-react"
import { ProjectionChart } from "@/components/projection-chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import UsdRendimientosScreen from "@/components/usd-rendimientos-screen"
import UsdRendimientosFaqScreen from "@/components/usd-rendimientos-faq-screen"
import RendimientosProtocolosScreen from "@/components/rendimientos-protocolos-screen"
import RendimientosProtocolosDetailScreen from "@/components/rendimientos-protocolos-detail-screen"
import UsdProyeccionScreen from "@/components/usd-proyeccion-screen"
import { useState } from "react"

type DolarsScreen =
  | "main"
  | "rendimientos"
  | "rendimientos-faq"
  | "rendimientos-protocolos"
  | "rendimientos-protocolos-detail"
  | "proyeccion"

interface DollarsScreenProps {
  onClose: () => void
  balance?: number
}

const RATE = 0.102

function MainDollarsView({
  balance,
  onClose,
  onRendimientos,
  onProyeccion,
}: {
  balance: number
  onClose: () => void
  onRendimientos: () => void
  onProyeccion: () => void
}) {
  const projections = useMemo(() => {
    const calc = (years: number) => {
      const finalValue = balance * Math.pow(1 + RATE, years)
      return { finalValue: Math.round(finalValue), earnings: Math.round(finalValue - balance) }
    }
    return { y5: calc(5), y10: calc(10), y30: calc(30) }
  }, [balance])

  const balanceStr = balance.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background no-scrollbar">
      {/* Header */}
      <header className="relative px-5 pt-4 pb-2">
        <button
          onClick={onClose}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold text-foreground">
          Dolares digitales
        </h1>
      </header>

      {/* Balance */}
      <section className="px-5 pt-6">
        <div>
          <p className="text-lg font-medium text-foreground">US$</p>
          <h1 className="text-[38px] font-bold leading-none tracking-tight text-foreground">
            {balanceStr}
          </h1>
        </div>

        <button
          onClick={onRendimientos}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-lime px-4 py-2 transition-transform active:scale-[0.97]"
        >
          <span className="h-2 w-2 rounded-full bg-foreground animate-pulse-dot" />
          <span className="text-sm font-semibold text-accent-lime-foreground">
            Creciendo 10,2% anual
          </span>
          <ChevronRight className="h-4 w-4 text-accent-lime-foreground/70" />
        </button>
      </section>

      {/* Action Buttons */}
      <section className="mt-8 flex justify-between px-8">
        <button className="flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
            <Download className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-foreground">Depositar</span>
        </button>
        <button className="flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-foreground">Comprar</span>
        </button>
        <button className="flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
            <Banknote className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-foreground">Vender</span>
        </button>
        <button className="flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
            <Send className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-foreground">Enviar</span>
        </button>
      </section>

      {/* Cotización Card */}
      <section className="mx-5 mt-8">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold text-foreground">{"Cotizacion del dia"}</p>
          <div className="mt-4 flex gap-8">
            <div>
              <p className="text-xs text-muted-foreground">Precio de compra</p>
              <p className="mt-1 text-lg font-bold text-foreground">$1.345,11</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio de venta</p>
              <p className="mt-1 text-lg font-bold text-foreground">$1.378,23</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projection Card */}
      <section className="mx-5 mt-4">
        <TooltipProvider>
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-bold text-foreground">Tus dolares creciendo</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Proyeccion en el tiempo con interes compuesto.
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[240px] text-xs">
                  Esta proyeccion es estimativa y asume una tasa constante del 10,2% anual. Los rendimientos reales pueden variar.
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-5 flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">5 anos</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  ${projections.y5.finalValue.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">10 anos</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  ${projections.y10.finalValue.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">30 anos</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  ${projections.y30.finalValue.toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <ProjectionChart
                principal={balance}
                rate={RATE}
                years={30}
                monthlyContribution={0}
                showTooltip={false}
              />
            </div>

            <button
              onClick={onProyeccion}
              className="mt-5 flex w-full items-center justify-center rounded-full bg-foreground py-3.5 text-sm font-semibold text-background transition-transform active:scale-[0.98]"
            >
              Simular proyeccion
            </button>
          </div>
        </TooltipProvider>
      </section>

      <div className="pb-8" />
    </main>
  )
}

export default function DollarsScreen({ onClose, balance = 900 }: DollarsScreenProps) {
  const [screen, setScreen] = useState<DolarsScreen>("main")
  const [protocolId, setProtocolId] = useState("aave")

  const navigate = (s: DolarsScreen, pid?: string) => {
    if (pid) setProtocolId(pid)
    setScreen(s)
  }

  if (screen === "rendimientos-faq") {
    return <UsdRendimientosFaqScreen onBack={() => setScreen("rendimientos")} />
  }

  if (screen === "rendimientos-protocolos-detail") {
    return (
      <RendimientosProtocolosDetailScreen
        protocolId={protocolId}
        onBack={() => setScreen("rendimientos-protocolos")}
      />
    )
  }

  if (screen === "rendimientos-protocolos") {
    return (
      <RendimientosProtocolosScreen
        onBack={() => setScreen("rendimientos")}
        onProtocolDetail={(id) => navigate("rendimientos-protocolos-detail", id)}
      />
    )
  }

  if (screen === "rendimientos") {
    return (
      <UsdRendimientosScreen
        onBack={() => setScreen("main")}
        onFaq={() => setScreen("rendimientos-faq")}
        onProtocolos={() => setScreen("rendimientos-protocolos")}
      />
    )
  }

  if (screen === "proyeccion") {
    return <UsdProyeccionScreen onBack={() => setScreen("main")} principal={balance} />
  }

  return (
    <MainDollarsView
      balance={balance}
      onClose={onClose}
      onRendimientos={() => setScreen("rendimientos")}
      onProyeccion={() => setScreen("proyeccion")}
    />
  )
}
