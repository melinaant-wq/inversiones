"use client"

import { ArrowLeft, Zap, Shield, Clock, TrendingUp } from "lucide-react"

const beneficios = [
  {
    icon: TrendingUp,
    title: "Mayor rendimiento",
    description:
      "sARS ofrece una tasa del 29,5% TNA, superando a billeteras digitales y bancos tradicionales gracias a la optimizacion de protocolos descentralizados.",
  },
  {
    icon: Shield,
    title: "Respaldo transparente",
    description:
      "Cada sARS esta respaldado 1:1 por activos auditados y verificables on-chain. Tu dinero siempre tiene un respaldo real y rastreable.",
  },
  {
    icon: Clock,
    title: "Liquidez inmediata",
    description:
      "Podes retirar tus pesos en cualquier momento, sin periodos de espera ni penalidades. Tu dinero disponible las 24 horas, los 7 dias.",
  },
  {
    icon: Zap,
    title: "Acreditacion diaria",
    description:
      "Las ganancias se acreditan automaticamente todos los dias en tu cuenta. No necesitas hacer nada, tu plata crece sola.",
  },
]

export default function RendimientosSarsScreen({ onBack }: { onBack: () => void }) {
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
          <h1 className="text-lg font-bold text-foreground">sARS</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-accent-lime p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-lime-foreground/60">
            Moneda sintetica
          </p>
          <h2 className="mt-2 text-3xl font-bold text-accent-lime-foreground text-balance">
            {"sARS (sur ARS)"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-accent-lime-foreground/80">
            sARS es una moneda sintetica que replica el valor del peso argentino y permite
            generar rendimientos superiores al mercado. Tu dinero sigue siendo pesos, pero
            trabaja mas por vos.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mt-6 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <p className="text-base font-bold text-foreground">{"Como funciona?"}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cuando activas los rendimientos en Lemon, tus pesos se convierten automaticamente
            en sARS. Esta moneda sintetica permite que tu dinero se invierta en protocolos DeFi
            optimizados, generando una tasa del 29,5% anual.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Al retirar, tus sARS se convierten instantaneamente de vuelta a pesos argentinos al
            tipo de cambio 1:1. No hay riesgo cambiario ni costos ocultos.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mt-4 px-5">
        <p className="mb-3 text-sm font-bold text-foreground px-1">Beneficios</p>
        <div className="flex flex-col gap-3">
          {beneficios.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-lime">
                <item.icon className="h-5 w-5 text-accent-lime-foreground" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-6 px-5 pb-10">
        <button
          onClick={onBack}
          className="flex w-full items-center justify-center rounded-full bg-foreground py-4 text-sm font-semibold text-background transition-transform active:scale-[0.98]"
        >
          Volver a Rendimientos
        </button>
      </section>
    </main>
  )
}
