"use client"

import { ArrowLeft, Shield, ExternalLink, CheckCircle2 } from "lucide-react"

const protocolsData: Record<string, {
  name: string
  fullName: string
  initial: string
  tea: string
  website: string
  description: string
  longDescription: string
  stats: { label: string; value: string }[]
  auditors: string[]
  details: { label: string; value: string }[]
  howItWorks: { title: string; description: string }[]
}> = {
  aave: {
    name: "AAVE",
    fullName: "AAVE v3",
    initial: "A",
    tea: "10,2%",
    website: "https://aave.com",
    description: "Protocolo de lending descentralizado",
    longDescription: "AAVE es el protocolo de lending descentralizado mas grande del mundo. Tu capital se presta a prestatarios sobrecolateralizados, generando intereses de forma segura y continua.",
    stats: [
      { label: "Antiguedad", value: "4 anos" },
      { label: "Fondos en custodia", value: "USD 12.3B" },
      { label: "Inversores activos", value: "89.400+" },
    ],
    auditors: ["Trail of Bits", "OpenZeppelin", "SigmaPrime", "Certora"],
    details: [
      { label: "Protocolo", value: "AAVE v3" },
      { label: "Red", value: "Ethereum Mainnet" },
      { label: "Tipo de activo", value: "USDC (stablecoin)" },
      { label: "Liquidez", value: "Retiro inmediato, sin lock-up" },
      { label: "Frecuencia de acreditacion", value: "Diaria, automatica" },
      { label: "Perfil de riesgo", value: "Bajo - Lending conservador" },
    ],
    howItWorks: [
      { title: "Depositas dolares", description: "Tus dolares se convierten en USDC, una stablecoin respaldada 1:1 por el dolar estadounidense." },
      { title: "Se prestan con garantia", description: "Los prestatarios deben depositar mas valor del que piden prestado (sobrecolateralizacion), lo que protege tu capital." },
      { title: "Ganas intereses", description: "Los intereses se acreditan a tu cuenta diariamente de forma automatica. Podes retirar cuando quieras." },
    ],
  },
  morpho: {
    name: "Morpho",
    fullName: "Morpho Blue",
    initial: "M",
    tea: "7,2%",
    website: "https://morpho.org",
    description: "Optimizador de lending descentralizado",
    longDescription: "Morpho optimiza las tasas de interes conectando prestamistas y prestatarios de forma peer-to-peer sobre protocolos existentes, mejorando la eficiencia del capital.",
    stats: [
      { label: "Antiguedad", value: "3 anos" },
      { label: "Fondos en custodia", value: "USD 4.8B" },
      { label: "Inversores activos", value: "42.100+" },
    ],
    auditors: ["Spearbit", "Trail of Bits", "Cantina"],
    details: [
      { label: "Protocolo", value: "Morpho Blue" },
      { label: "Red", value: "Ethereum Mainnet" },
      { label: "Tipo de activo", value: "USDC (stablecoin)" },
      { label: "Liquidez", value: "Retiro inmediato, sin lock-up" },
      { label: "Frecuencia de acreditacion", value: "Diaria, automatica" },
      { label: "Perfil de riesgo", value: "Bajo - Lending optimizado" },
    ],
    howItWorks: [
      { title: "Depositas dolares", description: "Tus dolares se convierten en USDC y se depositan en el pool de Morpho." },
      { title: "Matching peer-to-peer", description: "Morpho conecta tu deposito directamente con prestatarios, eliminando intermediarios y mejorando las tasas." },
      { title: "Ganas intereses optimizados", description: "Recibes tasas mejoradas gracias a la eficiencia del matching directo entre prestamistas y prestatarios." },
    ],
  },
  fluid: {
    name: "Fluid",
    fullName: "Fluid Protocol",
    initial: "F",
    tea: "9,5%",
    website: "https://fluid.instadapp.io",
    description: "Protocolo de liquidez dinamica",
    longDescription: "Fluid combina lending y DEX en una sola capa de liquidez, permitiendo que tu capital genere rendimientos de multiples fuentes simultaneamente.",
    stats: [
      { label: "Antiguedad", value: "2 anos" },
      { label: "Fondos en custodia", value: "USD 1.2B" },
      { label: "Inversores activos", value: "18.500+" },
    ],
    auditors: ["OpenZeppelin", "Dedaub", "Statemind"],
    details: [
      { label: "Protocolo", value: "Fluid Protocol" },
      { label: "Red", value: "Ethereum Mainnet" },
      { label: "Tipo de activo", value: "USDC (stablecoin)" },
      { label: "Liquidez", value: "Retiro inmediato, sin lock-up" },
      { label: "Frecuencia de acreditacion", value: "Diaria, automatica" },
      { label: "Perfil de riesgo", value: "Medio - Liquidez dinamica" },
    ],
    howItWorks: [
      { title: "Depositas dolares", description: "Tus dolares se convierten en USDC y entran al pool de liquidez de Fluid." },
      { title: "Liquidez multi-uso", description: "Tu capital se utiliza simultaneamente para lending y como liquidez en el DEX integrado." },
      { title: "Rendimientos combinados", description: "Ganas intereses de prestamos mas comisiones de trading, maximizando el rendimiento de tu capital." },
    ],
  },
  pendle: {
    name: "Pendle",
    fullName: "Pendle Finance",
    initial: "P",
    tea: "12,1%",
    website: "https://pendle.finance",
    description: "Protocolo de yield tokenization",
    longDescription: "Pendle permite separar y comerciar los rendimientos futuros de activos, creando oportunidades unicas para maximizar ganancias o asegurar tasas fijas.",
    stats: [
      { label: "Antiguedad", value: "1 ano" },
      { label: "Fondos en custodia", value: "USD 890M" },
      { label: "Inversores activos", value: "9.200+" },
    ],
    auditors: ["Ackee Blockchain", "Dedaub"],
    details: [
      { label: "Protocolo", value: "Pendle Finance" },
      { label: "Red", value: "Ethereum / Arbitrum" },
      { label: "Tipo de activo", value: "USDC (stablecoin)" },
      { label: "Liquidez", value: "Variable segun vencimiento" },
      { label: "Frecuencia de acreditacion", value: "Al vencimiento o venta" },
      { label: "Perfil de riesgo", value: "Medio-Alto - Yield trading" },
    ],
    howItWorks: [
      { title: "Depositas dolares", description: "Tus dolares se convierten en USDC y se depositan en estrategias de Pendle." },
      { title: "Tokenizacion del yield", description: "Pendle separa tu deposito en principal (PT) y rendimiento futuro (YT), permitiendo estrategias avanzadas." },
      { title: "Rendimientos amplificados", description: "Al comprar YT tokens, podes obtener rendimientos amplificados sobre los activos subyacentes." },
    ],
  },
}

export default function RendimientosProtocolosDetailScreen({
  protocolId,
  onBack,
}: {
  protocolId: string
  onBack: () => void
}) {
  const protocol = protocolsData[protocolId]

  if (!protocol) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Protocolo no encontrado</p>
        <button onClick={onBack} className="mt-4 text-sm text-foreground underline">
          Volver a protocolos
        </button>
      </main>
    )
  }

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
          <h1 className="text-lg font-bold text-foreground">Detalle del protocolo</h1>
        </div>
      </header>

      {/* Protocol Identity */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-background">{protocol.initial}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{protocol.fullName}</h2>
              <p className="text-sm text-muted-foreground">{protocol.description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Protocolo auditado</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {protocol.longDescription}
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="mt-4 px-5">
        <div className="flex gap-3">
          {protocol.stats.map((stat) => (
            <div key={stat.label} className="flex-1 rounded-2xl bg-card p-4 shadow-sm">
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              <p className="mt-1.5 text-sm font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Details */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold text-foreground">Detalles tecnicos</h3>
          <div className="mt-4 flex flex-col gap-4">
            {protocol.details.map((detail) => (
              <div key={detail.label} className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-sm text-muted-foreground">{detail.label}</span>
                <span className="text-right text-sm font-medium text-foreground">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audits */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold text-foreground">Auditorias de seguridad</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {protocol.name} ha sido auditado por firmas de seguridad reconocidas en la industria.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {protocol.auditors.map((auditor) => (
              <div key={auditor} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">{auditor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold text-foreground">{"Como funciona"}</h3>
          <div className="mt-4 flex flex-col gap-4">
            {protocol.howItWorks.map((step, index) => (
              <div key={step.title} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-lime text-xs font-bold text-accent-lime-foreground">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* External link */}
      <section className="mt-4 px-5 pb-10">
        <a
          href={protocol.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-card p-4 shadow-sm transition-colors active:bg-secondary"
        >
          <span className="text-sm font-semibold text-foreground">
            Ver protocolo en {protocol.website.replace("https://", "")}
          </span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      </section>
    </main>
  )
}
