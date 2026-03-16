"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ChevronRight, Download, Send, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import RendimientosScreen from "@/components/rendimientos-screen"
import RendimientosFaqScreen from "@/components/rendimientos-faq-screen"
import RendimientosSarsScreen from "@/components/rendimientos-sars-screen"
import RendimientosProtocolosScreen from "@/components/rendimientos-protocolos-screen"
import RendimientosProtocolosDetailScreen from "@/components/rendimientos-protocolos-detail-screen"
import MovimientosScreen from "@/components/movimientos-screen"

type PesosScreen =
  | "main"
  | "rendimientos"
  | "rendimientos-faq"
  | "rendimientos-sars"
  | "rendimientos-protocolos"
  | "rendimientos-protocolos-detail"
  | "movimientos"

interface CashScreenProps {
  onClose: () => void
  balance?: number
}

const PREVIEW_MOVIMIENTOS = [
  {
    id: 1,
    tipo: "ingreso" as const,
    descripcion: "Deposito recibido",
    fecha: "28 Feb 2026",
    monto: "+$125.000,00",
  },
  {
    id: 2,
    tipo: "egreso" as const,
    descripcion: "Transferencia enviada",
    fecha: "25 Feb 2026",
    monto: "-$32.500,00",
  },
]

function AnimatedBalance({ balance }: { balance: number }) {
  const ANNUAL_RATE = 0.295
  const PER_SECOND = ANNUAL_RATE / (365.25 * 24 * 3600)

  const startRef = useRef(Date.now())
  const [centavos, setCentavos] = useState(0)

  useEffect(() => {
    let raf: number
    function tick() {
      const elapsed = (Date.now() - startRef.current) / 1000
      const earned = balance * PER_SECOND * elapsed
      setCentavos(Math.floor((earned * 100) % 100))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [balance, PER_SECOND])

  const display = centavos.toString().padStart(2, "0")

  return (
    <div>
      <p className="text-lg font-medium text-foreground">sARS</p>
      <h1 className="text-[38px] font-bold leading-none tracking-tight text-foreground">
        {Math.floor(balance).toLocaleString("es-AR")},
        <span className="inline-block text-[20px] font-bold tabular-nums text-muted-foreground/50 transition-[opacity] duration-150">
          {display}
        </span>
      </h1>
    </div>
  )
}

function MainPesosView({
  balance,
  onClose,
  onRendimientos,
  onMovimientos,
}: {
  balance: number
  onClose: () => void
  onRendimientos: () => void
  onMovimientos: () => void
}) {
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
          Pesos
        </h1>
      </header>

      {/* Balance */}
      <section className="px-5 pt-6">
        <AnimatedBalance balance={balance} />

        <button
          onClick={onRendimientos}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-lime px-4 py-2 transition-transform active:scale-[0.97]"
        >
          <span className="h-2 w-2 rounded-full bg-foreground animate-pulse-dot" />
          <span className="text-sm font-semibold text-accent-lime-foreground">
            Creciendo 29,5% anual
          </span>
          <ChevronRight className="h-4 w-4 text-accent-lime-foreground/70" />
        </button>
      </section>

      {/* Action Buttons */}
      <section className="flex justify-start gap-8 px-8 mt-8">
        <button className="flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
            <Download className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-foreground">Depositar</span>
        </button>
        <button className="flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
            <Send className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-foreground">Enviar</span>
        </button>
      </section>

      {/* Movimientos preview */}
      <section className="mx-5 mt-8">
        <div className="flex items-center justify-between pb-3">
          <p className="text-sm font-semibold text-foreground">Movimientos</p>
          <button onClick={onMovimientos} aria-label="Ver todos los movimientos">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col">
          {PREVIEW_MOVIMIENTOS.map((mov) => (
            <div key={mov.id} className="flex items-center gap-4 py-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                {mov.tipo === "ingreso" ? (
                  <ArrowDownLeft className="h-5 w-5 text-foreground" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium text-foreground">{mov.descripcion}</p>
                <p className="text-xs text-muted-foreground">{mov.fecha}</p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  mov.tipo === "ingreso" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {mov.monto}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="pb-8" />
    </main>
  )
}

export default function CashScreen({ onClose, balance = 500000 }: CashScreenProps) {
  const [screen, setScreen] = useState<PesosScreen>("main")
  const [protocolId, setProtocolId] = useState<string>("aave")

  const navigate = (s: PesosScreen, pid?: string) => {
    if (pid) setProtocolId(pid)
    setScreen(s)
  }

  if (screen === "movimientos") {
    return <MovimientosScreen onBack={() => setScreen("main")} />
  }

  if (screen === "rendimientos-faq") {
    return <RendimientosFaqScreen onBack={() => setScreen("rendimientos")} />
  }

  if (screen === "rendimientos-sars") {
    return <RendimientosSarsScreen onBack={() => setScreen("rendimientos")} />
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
      <RendimientosScreen
        onBack={() => setScreen("main")}
        onFaq={() => setScreen("rendimientos-faq")}
        onSars={() => setScreen("rendimientos-sars")}
        onProtocolos={() => setScreen("rendimientos-protocolos")}
      />
    )
  }

  return (
    <MainPesosView
      balance={balance}
      onClose={onClose}
      onRendimientos={() => setScreen("rendimientos")}
      onMovimientos={() => setScreen("movimientos")}
    />
  )
}
