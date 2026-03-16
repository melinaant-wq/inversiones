"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowUpRight, ArrowDownRight, Package, BarChart3, TrendingUp, ArrowLeft, X } from "lucide-react"
import { STOCKS, PACKS, Stock, Pack, getHolding } from "./inversiones-flow"

interface Props {
  context: "buy" | "search"
  onClose: () => void
  onOpenStockDetail: (id: string) => void
  onOpenBuy: (id: string) => void
  onOpenPackDetail: (id: string) => void
}

type TabType = "packs" | "etfs" | "stocks"

const VOLATILITY_ORDER: Record<string, number> = { "Baja": 0, "Media": 1, "Alta": 2 }

// ── Stock Avatar: clearbit → Google favicon → initials ───────
function StockAvatar({ stock, size = 10 }: { stock: Stock; size?: number }) {
  const [imgState, setImgState] = useState<"primary" | "fallback" | "error">("primary")
  const px = size * 4
  const domain = stock.logo?.replace("https://logo.clearbit.com/", "")
  const fallbackSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
  const showInitials = imgState === "error" || (!stock.logo && !fallbackSrc)
  const src = imgState === "fallback" && fallbackSrc ? fallbackSrc : stock.logo
  return (
    <div
      className="rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
      style={{
        background: showInitials ? stock.color : "#ffffff",
        border: `1.5px solid ${stock.color}30`,
        width: px,
        height: px,
        minWidth: px,
      }}
    >
      {!showInitials && src ? (
        <img
          src={src}
          alt={stock.symbol}
          style={{ width: px * 0.6, height: px * 0.6, objectFit: "contain" }}
          onError={() => setImgState((s) => s === "primary" ? "fallback" : "error")}
        />
      ) : (
        <span className="font-bold text-white" style={{ fontSize: px * 0.28, lineHeight: 1 }}>
          {stock.symbol.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

// ── Mini stock avatar for pack cards (3-state fallback) ───────
function MiniStockAvatar({ stock, borderColor }: { stock: Stock; borderColor: string }) {
  const [imgState, setImgState] = useState<"primary" | "fallback" | "error">("primary")
  const domain = stock.logo?.replace("https://logo.clearbit.com/", "")
  const fallbackSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
  const showInitials = imgState === "error" || (!stock.logo && !fallbackSrc)
  const src = imgState === "fallback" && fallbackSrc ? fallbackSrc : stock.logo
  return (
    <div
      className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center border-2"
      style={{ background: showInitials ? stock.color : "#ffffff", borderColor }}
    >
      {!showInitials && src ? (
        <img
          src={src}
          alt={stock.symbol}
          style={{ width: 16, height: 16, objectFit: "contain" }}
          onError={() => setImgState((s) => s === "primary" ? "fallback" : "error")}
        />
      ) : (
        <span className="text-[9px] font-bold" style={{ color: "#ffffff" }}>
          {stock.symbol.slice(0, 1)}
        </span>
      )}
    </div>
  )
}

// Editorial taglines for ETFs
const ETF_TAGLINES: Record<string, string> = {
  SPY: "Las 500 empresas más grandes de EE.UU.",
  QQQ: "Las 100 gigantes tecnológicas",
  VTI: "Todo el mercado americano de un solo movimiento",
  EEM: "Mercados emergentes: China, India, Brasil y más",
}

const STOCK_FILTERS = [
  { label: "Populares",   ids: ["AAPL", "NVDA", "MSFT", "AMZN", "GOOGL", "META"], description: null },
  { label: "Dividendos",  ids: ["AAPL", "MSFT", "AMZN", "GOOGL"], description: "Las empresas que reparten parte de sus ganancias a sus accionistas de forma regular." },
  { label: "Tecnología",  ids: ["NVDA", "AMD", "MSFT", "AAPL", "META", "GOOGL"], description: null },
  { label: "Movimientos", ids: ["TSLA", "NVDA", "META", "AMD"], description: null },
]

const ETF_IDS_SHOWN = ["SPY", "QQQ", "VTI"]
const TRENDING_IDS = ["AAPL", "NVDA", "MSFT", "AMZN"]

export default function InversionesMercado({ context, onClose, onOpenStockDetail, onOpenBuy, onOpenPackDetail }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("packs")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchActive, setSearchActive] = useState(context === "search")
  const [activeFilter, setActiveFilter] = useState("Populares")

  const stocks = STOCKS.filter((s) => s.type === "stock")
  const etfs = STOCKS.filter((s) => s.type === "etf")

  // Sorted Baja → Media → Alta (newbie-friendly)
  const sortedPacks = useMemo(
    () => [...PACKS].sort((a, b) => VOLATILITY_ORDER[a.volatility] - VOLATILITY_ORDER[b.volatility]),
    []
  )

  const searchResults = useMemo(() => {
    if (!searchQuery) return { stocks: [], etfs: [], packs: [] }
    const q = searchQuery.toLowerCase()
    return {
      stocks: stocks.filter((s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)),
      etfs: etfs.filter((s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)),
      packs: PACKS.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    }
  }, [searchQuery, stocks, etfs])

  const isSearching = searchActive && searchQuery.length > 0
  const hasResults = isSearching && (searchResults.stocks.length + searchResults.etfs.length + searchResults.packs.length) > 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <h1 className="text-[16px] font-semibold flex-1" style={{ color: "#1c1c1a" }}>
            {context === "buy" ? "Mercado" : "Buscar"}
          </h1>
          {context !== "search" && (
            <button
              onClick={() => setSearchActive(!searchActive)}
              className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{ background: searchActive ? "rgba(28,28,26,0.12)" : "rgba(28,28,26,0.06)" }}
            >
              <Search className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            </button>
          )}
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {(searchActive || context === "search") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(28,28,26,0.35)" }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="AAPL, Tesla, S&P 500..."
                  className="flex-1 bg-transparent text-[14px] outline-none"
                  style={{ color: "#1c1c1a" }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.35)" }} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs — secondary style, no black */}
        {!isSearching && (
          <div
            className="flex p-0.5 rounded-2xl"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            {(
              [
                { id: "packs" as TabType, label: "Packs", icon: Package },
                { id: "etfs" as TabType, label: "ETFs", icon: TrendingUp },
                { id: "stocks" as TabType, label: "Acciones", icon: BarChart3 },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all active:scale-95"
                style={{ background: activeTab === tab.id ? "rgba(28,28,26,0.10)" : "transparent" }}
              >
                <tab.icon
                  className="w-3.5 h-3.5"
                  style={{ color: activeTab === tab.id ? "#1c1c1a" : "rgba(28,28,26,0.4)" }}
                />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: activeTab === tab.id ? "#1c1c1a" : "rgba(28,28,26,0.5)" }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">

          {/* ── Search results ── */}
          {isSearching && (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {!hasResults ? (
                <EmptySearch />
              ) : (
                <>
                  {searchResults.etfs.length > 0 && (
                    <>
                      <SectionLabel label="ETFs" />
                      {searchResults.etfs.map((s, i) => (
                        <MinimalRow key={s.id} stock={s} index={i} tagline={ETF_TAGLINES[s.id]} onTap={() => onOpenStockDetail(s.id)} onBuy={() => onOpenBuy(s.id)} showBuy={context === "buy"} />
                      ))}
                    </>
                  )}
                  {searchResults.packs.length > 0 && (
                    <>
                      <SectionLabel label="Packs" />
                      {searchResults.packs.map((p, i) => (
                        <PackRow key={p.id} pack={p} index={i} onViewDetail={() => onOpenPackDetail(p.id)} />
                      ))}
                    </>
                  )}
                  {searchResults.stocks.length > 0 && (
                    <>
                      <SectionLabel label="Acciones" />
                      {searchResults.stocks.map((s, i) => (
                        <MinimalRow key={s.id} stock={s} index={i} onTap={() => onOpenStockDetail(s.id)} onBuy={() => onOpenBuy(s.id)} showBuy={context === "buy"} />
                      ))}
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── Packs tab — sorted low → high volatility ── */}
          {!isSearching && activeTab === "packs" && (
            <motion.div
              key="packs"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-3"
            >
              <div className="mb-1">
                <h3 className="text-[16px] font-bold mb-1" style={{ color: "#1c1c1a" }}>
                  Estrategias armadas para vos
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(28,28,26,0.45)" }}>
                  Nuestros analistas combinaron los mejores activos según distintos objetivos. Invertís en varios de una sola vez.
                </p>
              </div>
              {sortedPacks.map((pack, i) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  index={i}
                  onViewDetail={() => onOpenPackDetail(pack.id)}
                />
              ))}
            </motion.div>
          )}

          {/* ── ETFs tab ── */}
          {!isSearching && activeTab === "etfs" && (
            <motion.div
              key="etfs"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-3"
            >
              <div className="mb-1">
                <h3 className="text-[16px] font-bold mb-1" style={{ color: "#1c1c1a" }}>
                  Invertí en cientos de empresas a la vez
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(28,28,26,0.45)" }}>
                  Un ETF agrupa decenas o cientos de acciones. Diversificás el riesgo sin tener que elegir empresa por empresa.
                </p>
              </div>
              {etfs
                .filter((s) => ETF_IDS_SHOWN.includes(s.id))
                .map((stock, i) => (
                  <ETFCard
                    key={stock.id}
                    stock={stock}
                    index={i}
                    tagline={ETF_TAGLINES[stock.id]}
                    onTap={() => onOpenStockDetail(stock.id)}
                    onBuy={() => onOpenBuy(stock.id)}
                    showBuy={context === "buy"}
                  />
                ))}
            </motion.div>
          )}

          {/* ── Acciones tab ── */}
          {!isSearching && activeTab === "stocks" && (
            <motion.div
              key="stocks"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* Filter chips — secondary style, no black */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                {STOCK_FILTERS.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setActiveFilter(f.label)}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95"
                    style={{
                      background: activeFilter === f.label ? "rgba(28,28,26,0.12)" : "rgba(28,28,26,0.07)",
                      color: activeFilter === f.label ? "#1c1c1a" : "rgba(28,28,26,0.55)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Description pill */}
              <AnimatePresence>
                {STOCK_FILTERS.find(f => f.label === activeFilter)?.description && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="px-3.5 py-3 rounded-2xl" style={{ background: "rgba(28,28,26,0.05)" }}>
                      <p className="text-[12px] leading-relaxed" style={{ color: "rgba(28,28,26,0.55)" }}>
                        {STOCK_FILTERS.find(f => f.label === activeFilter)?.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filtered stock list */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {(STOCK_FILTERS.find(f => f.label === activeFilter)?.ids ?? TRENDING_IDS)
                    .map((id) => STOCKS.find((s) => s.id === id))
                    .filter(Boolean)
                    .map((stock, i, arr) => (
                      <MinimalRow
                        key={stock!.id}
                        stock={stock!}
                        index={i}
                        onTap={() => onOpenStockDetail(stock!.id)}
                        onBuy={() => onOpenBuy(stock!.id)}
                        showBuy={false}
                        noBorder={i === arr.length - 1}
                      />
                    ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Minimal row ────────────────────────────────────────────────
function MinimalRow({
  stock, index, tagline, onTap, onBuy, showBuy, noBorder,
}: {
  stock: Stock; index: number; tagline?: string
  onTap: () => void; onBuy: () => void; showBuy: boolean; noBorder?: boolean
}) {
  const isUp = stock.change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.03 * index, duration: 0.2 }}
      className="flex items-center gap-3 py-3"
      style={noBorder ? {} : { borderBottom: "1px solid rgba(28,28,26,0.07)" }}
    >
      <button className="flex-1 flex items-center gap-3 active:opacity-70 transition-opacity" onClick={onTap}>
        <StockAvatar stock={stock} size={10} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold truncate" style={{ color: "#1c1c1a" }}>{stock.name}</p>
          <p className="text-[12px] truncate" style={{ color: "rgba(28,28,26,0.4)" }}>
            {tagline ?? `${stock.symbol} · ${stock.sector}`}
          </p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {isUp
            ? <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
            : <ArrowDownRight className="w-3.5 h-3.5" style={{ color: "#E63946" }} />
          }
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: isUp ? "#446e0c" : "#E63946" }}>
            {isUp ? "+" : ""}{stock.change.toFixed(2)}%
          </span>
        </div>
      </button>
      {showBuy && (
        <button
          onClick={onBuy}
          className="w-8 h-8 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
          style={{ background: "#ddf74c" }}
        >
          <span className="text-[16px] font-bold" style={{ color: "#1c1c1a", lineHeight: 1 }}>+</span>
        </button>
      )}
    </motion.div>
  )
}

// ── ETF Card ──────────────────────────────────────────────────
function ETFCard({ stock, index, tagline, onTap, onBuy, showBuy }: {
  stock: Stock; index: number; tagline?: string
  onTap: () => void; onBuy: () => void; showBuy: boolean
}) {
  const isUp = stock.change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.2 }}
      className="flex items-center gap-3 p-3.5 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer"
      style={{ background: "#FEFEFE" }}
      onClick={onTap}
    >
      <StockAvatar stock={stock} size={10} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>{stock.name}</p>
        <p className="text-[12px] truncate" style={{ color: "rgba(28,28,26,0.45)" }}>{tagline ?? stock.sector}</p>
      </div>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {isUp
          ? <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
          : <ArrowDownRight className="w-3.5 h-3.5" style={{ color: "#E63946" }} />}
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: isUp ? "#446e0c" : "#E63946" }}>
          {isUp ? "+" : ""}{stock.change.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  )
}

// ── Pack row (search results) ──────────────────────────────────
function PackRow({ pack, index, onViewDetail }: { pack: Pack; index: number; onViewDetail: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.03 * index, duration: 0.2 }}
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid rgba(28,28,26,0.07)" }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: pack.color }}>
        <Package className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold truncate" style={{ color: "#1c1c1a" }}>{pack.name}</p>
        <p className="text-[12px] truncate" style={{ color: "rgba(28,28,26,0.4)" }}>
          {pack.stocks.length} activos · +{pack.returnY}% en 12 meses
        </p>
      </div>
      <button
        onClick={onViewDetail}
        className="px-3 py-1.5 rounded-xl active:scale-95 transition-transform text-[12px] font-semibold flex-shrink-0"
        style={{ background: "rgba(28,28,26,0.08)", color: "#1c1c1a" }}
      >
        Ver detalle
      </button>
    </motion.div>
  )
}

// ── Pack Card (full) ───────────────────────────────────────────
function PackCard({ pack, index, onViewDetail }: { pack: Pack; index: number; onViewDetail: () => void }) {
  const dark = pack.darkText
  const fg      = dark ? "#1c1c1a"             : "#ffffff"
  const fgMid   = dark ? "rgba(28,28,26,0.60)" : "rgba(255,255,255,0.60)"
  const fgLow   = dark ? "rgba(28,28,26,0.40)" : "rgba(255,255,255,0.50)"
  const fgBadgeBg  = dark ? "rgba(28,28,26,0.10)" : "rgba(255,255,255,0.10)"
  const fgBadgeTxt = dark ? "rgba(28,28,26,0.65)" : "rgba(255,255,255,0.70)"
  const accent  = dark ? "#1c1c1a"             : "#ddf74c"
  const btnBg   = dark ? "rgba(28,28,26,0.14)" : "#ddf74c"
  const btnTxt  = dark ? "#1c1c1a"             : "#1c1c1a"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.25 }}
      className="p-4 rounded-2xl overflow-hidden relative"
      style={{ background: pack.color }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[15px] font-bold" style={{ color: fg }}>{pack.name}</p>
            <p className="text-[12px] mt-0.5 max-w-[180px]" style={{ color: fgMid }}>
              {pack.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: accent }} />
              <span className="text-[14px] font-bold" style={{ color: accent }}>+{pack.returnY}%</span>
            </div>
            <span className="text-[10px]" style={{ color: fgLow }}>12 meses</span>
          </div>
        </div>

        {/* 3 company avatars */}
        <div className="flex items-center gap-1.5 mb-3">
          {pack.stocks.slice(0, 3).map((sid) => {
            const s = STOCKS.find((x) => x.id === sid)
            if (!s) return null
            return <MiniStockAvatar key={sid} stock={s} borderColor={pack.color} />
          })}
          <span className="text-[11px] ml-1" style={{ color: fgLow }}>
            {pack.stocks.length} activos
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-semibold px-2 py-1 rounded-lg"
            style={{ background: fgBadgeBg, color: fgBadgeTxt }}
          >
            Volatilidad {pack.volatility}
          </span>
          <button
            onClick={onViewDetail}
            className="px-4 py-2 rounded-xl active:scale-95 transition-transform text-[13px] font-semibold"
            style={{ background: btnBg, color: btnTxt }}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Helpers ────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider mb-2 mt-4 first:mt-0" style={{ color: "rgba(28,28,26,0.35)" }}>
      {label}
    </p>
  )
}

function EmptySearch() {
  return (
    <div className="flex flex-col items-center py-10">
      <Search className="w-10 h-10 mb-3" style={{ color: "rgba(28,28,26,0.15)" }} />
      <p className="text-[14px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>Sin resultados</p>
    </div>
  )
}
