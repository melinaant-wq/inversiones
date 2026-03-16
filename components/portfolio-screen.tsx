"use client"

const USD_RATE = 1453

const ASSETS = [
  {
    id: "pesos",
    label: "Pesos",
    balance: (pesosBalance: number) => `$${Math.floor(pesosBalance).toLocaleString("es-AR")},18`,
    pct: "8,36%",
    icon: "🇦🇷",
    iconBg: "#74ACDF",
  },
  {
    id: "dolares",
    label: "Dólares digitales",
    balance: () => "U$900,18",
    pct: "8,36%",
    icon: "🇺🇸",
    iconBg: "#3C3B6E",
  },
  {
    id: "crypto",
    label: "Bitcoin & Crypto",
    balance: () => "U$1.900,18",
    pct: "8,36%",
    icon: "₿",
    iconBg: "#F7931A",
  },
  {
    id: "inversiones",
    label: "Acciones",
    balance: () => "U$1.900,18",
    pct: "8,36%",
    icon: "📈",
    iconBg: "#1c1c1a",
  },
]

export default function PortfolioScreen({
  onOpenDollars,
  onOpenInvestments,
  onOpenCash,
  pesosBalance = 4000000,
}: {
  onOpenDollars?: () => void
  onOpenInvestments?: () => void
  onOpenCash?: () => void
  pesosBalance?: number
}) {
  const handleTap = (id: string) => {
    if (id === "dolares") onOpenDollars?.()
    else if (id === "inversiones") onOpenInvestments?.()
    else if (id === "pesos") onOpenCash?.()
  }

  const totalUSD = (pesosBalance / USD_RATE + 900 + 1900 + 1900)
  const totalUSDStr = totalUSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const [intPart, decPart] = totalUSDStr.split(",")

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-5 pt-5 pb-6">
      {/* Balance total header */}
      <div className="mb-6">
        <p className="text-[17px] font-semibold" style={{ color: "#1c1c1a" }}>Balance total</p>
        <div className="flex items-baseline gap-0 mt-1">
          <span className="text-[48px] font-bold leading-none tracking-tight" style={{ color: "#1c1c1a", fontVariantNumeric: "tabular-nums" }}>
            ${intPart}
          </span>
          <span className="text-[24px] font-normal leading-none ml-0.5" style={{ color: "rgba(28,28,26,0.35)", fontVariantNumeric: "tabular-nums" }}>
            ,{decPart}
          </span>
        </div>
        <p className="text-[14px] font-medium mt-1.5" style={{ color: "#22c55e" }}>
          $123,22 (8,36%) Hoy
        </p>
      </div>

      {/* Asset cards */}
      <div className="flex flex-col gap-3">
        {ASSETS.map((asset) => (
          <button
            key={asset.id}
            onClick={() => handleTap(asset.id)}
            className="w-full text-left rounded-3xl px-5 py-5 active:scale-[0.98] transition-transform"
            style={{ background: "#ffffff" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                  {asset.id === "crypto" ? (
                    <span className="font-bold text-[18px]" style={{ color: "#F7931A" }}>₿</span>
                  ) : (
                    <span className="text-[22px]">{asset.icon}</span>
                  )}
                </div>
                <span className="text-[14px] font-medium" style={{ color: "rgba(28,28,26,0.45)" }}>
                  {asset.label}
                </span>
              </div>
              <span className="text-[15px] font-semibold" style={{ color: "#22c55e" }}>
                {asset.pct}
              </span>
            </div>
            <p className="text-[22px] font-bold mt-1 leading-tight" style={{ color: "#1c1c1a", fontVariantNumeric: "tabular-nums" }}>
              {asset.balance(pesosBalance)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
