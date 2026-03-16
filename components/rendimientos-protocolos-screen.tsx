"use client"

import { ArrowLeft } from "lucide-react"

const currentProtocol = {
  id: "aave",
  name: "AAVE",
  initial: "A",
  tea: "10,2%",
  funds: "USD 12.3B",
  age: "4 anos",
  investors: "89.400",
  description:
    "Protocolo de lending descentralizado que ofrece rendimientos estables con alta seguridad y liquidez.",
}

const protocols = [
  {
    id: "morpho",
    name: "Morpho",
    initial: "M",
    tea: "7,2%",
    funds: "USD 4.8B",
    age: "3 anos",
    investors: "42.100",
    description:
      "Estrategia balanceada que busca mayores retornos manteniendo un perfil de riesgo bajo mediante diversificacion de pools.",
  },
  {
    id: "fluid",
    name: "Fluid",
    initial: "F",
    tea: "9,5%",
    funds: "USD 1.2B",
    age: "2 anos",
    investors: "18.500",
    description:
      "Aprovecha oportunidades de mercado con rebalanceo automatico. Mayor volatilidad pero retornos superiores.",
  },
  {
    id: "pendle",
    name: "Pendle",
    initial: "P",
    tea: "12,1%",
    funds: "USD 890M",
    age: "1 ano",
    investors: "9.200",
    description:
      "Maximiza rendimientos a traves de estrategias avanzadas de yield tokenization. Ideal para perfiles mas arriesgados.",
  },
]

export default function RendimientosProtocolosScreen({
  onBack,
  onProtocolDetail,
}: {
  onBack: () => void
  onProtocolDetail: (id: string) => void
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
          <h1 className="text-lg font-bold text-foreground">Configura tu inversion</h1>
        </div>
      </header>

      {/* Current Protocol Card - Dark */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-background">{currentProtocol.tea}</p>
                <span className="rounded-full bg-accent-lime px-2 py-0.5 text-[10px] font-semibold text-accent-lime-foreground">
                  Activo
                </span>
              </div>
              <p className="mt-1 text-sm text-background/60">{currentProtocol.name}</p>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full bg-background/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-background">{currentProtocol.initial}</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-background/70 leading-relaxed">
            {currentProtocol.description}
          </p>

          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-xl bg-background/10 p-2.5">
              <p className="text-[10px] text-background/50">Antiguedad</p>
              <p className="mt-0.5 text-xs font-bold text-background">{currentProtocol.age}</p>
            </div>
            <div className="flex-1 rounded-xl bg-background/10 p-2.5">
              <p className="text-[10px] text-background/50">Fondos</p>
              <p className="mt-0.5 text-xs font-bold text-background">{currentProtocol.funds}</p>
            </div>
            <div className="flex-1 rounded-xl bg-background/10 p-2.5">
              <p className="text-[10px] text-background/50">Inversores</p>
              <p className="mt-0.5 text-xs font-bold text-background">{currentProtocol.investors}</p>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => onProtocolDetail(currentProtocol.id)}
              className="flex-1 rounded-full border border-background/20 py-3 text-center text-sm font-semibold text-background transition-colors active:bg-background/10"
            >
              Saber mas
            </button>
            <button className="flex-1 rounded-full border border-[#C44536]/40 py-3 text-sm font-semibold text-[#C44536] transition-colors active:bg-[#C44536]/10">
              Desactivar
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <p className="text-sm font-medium text-muted-foreground">Otras inversiones disponibles</p>
      </section>

      <section className="mt-3 flex flex-col gap-4 px-5 pb-10">
        {protocols.map((proto) => (
          <div key={proto.name} className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{proto.tea}</p>
                <p className="mt-1 text-sm text-muted-foreground">{proto.name}</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-foreground">{proto.initial}</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{proto.description}</p>

            <div className="mt-4 flex gap-3">
              <div className="flex-1 rounded-xl bg-secondary p-2.5">
                <p className="text-[10px] text-muted-foreground">Antiguedad</p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{proto.age}</p>
              </div>
              <div className="flex-1 rounded-xl bg-secondary p-2.5">
                <p className="text-[10px] text-muted-foreground">Fondos</p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{proto.funds}</p>
              </div>
              <div className="flex-1 rounded-xl bg-secondary p-2.5">
                <p className="text-[10px] text-muted-foreground">Inversores</p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{proto.investors}</p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => onProtocolDetail(proto.id)}
                className="flex-1 rounded-full border border-border py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary active:scale-[0.97]"
              >
                Saber mas
              </button>
              <button className="flex-1 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition-transform active:scale-[0.97]">
                Cambiar
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
