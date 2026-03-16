"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import TransactionDetailSheet, { type TransactionDetail } from "./transaction-detail-sheet"

// ── Filter types ──────────────────────────────────────────────
type AssetId = "Pesos" | "D\u00f3lares" | "Bitcoin y Crypto" | "Inversiones"
type TypeId  = "Tarjeta" | "QR" | "Compra" | "Venta" | "Dep\u00f3sito" | "Retiro"
type FilterId = AssetId | TypeId

interface UnifiedFilter {
  id: FilterId
  kind: "asset" | "type"
}

const UNIFIED_FILTERS: UnifiedFilter[] = [
  { id: "Pesos",             kind: "asset" },
  { id: "D\u00f3lares",      kind: "asset" },
  { id: "Tarjeta",           kind: "type"  },
  { id: "QR",                kind: "type"  },
  { id: "Bitcoin y Crypto",  kind: "asset" },
  { id: "Inversiones",       kind: "asset" },
  { id: "Compra",            kind: "type"  },
  { id: "Venta",             kind: "type"  },
  { id: "Dep\u00f3sito",     kind: "type"  },
  { id: "Retiro",            kind: "type"  },
]

// ── Activity data ─────────────────────────────────────────────
interface ActivityItem extends TransactionDetail {
  day: number
  month: number
  year: number
  filterType: TypeId
  filterAsset: AssetId
}

const activityData: ActivityItem[] = [
  {
    id: "1", icon: "\uD83C\uDDE6\uD83C\uDDF7", title: "Rendimientos", date: "15 Ene", day: 15, month: 0, year: 2025,
    amount: "+ 10,11 ARS", isPositive: true, subtitle: "25,99%",
    fullDate: "15 de enero de 2025, 00:00", method: "Autom\u00e1tico", category: "Rendimientos",
    reference: "RND-20250115-001",
    filterType: "Dep\u00f3sito", filterAsset: "Pesos",
  },
  {
    id: "2", icon: "\uD83D\uDCB5", title: "Ganancias diarias", date: "15 Ene", day: 15, month: 0, year: 2025,
    amount: "+ 0,17 USDC", isPositive: true, subtitle: "247,11 ARS",
    fullDate: "15 de enero de 2025, 00:00", method: "Autom\u00e1tico", category: "Rendimientos USDC",
    reference: "YLD-20250115-002",
    filterType: "Dep\u00f3sito", filterAsset: "D\u00f3lares",
  },
  {
    id: "3", icon: "\uD83D\uDCC8", title: "Ganancia inversi\u00f3n", date: "14 Ene", day: 14, month: 0, year: 2025,
    amount: "+ 45,00 USD", isPositive: true, subtitle: "+2,3%",
    fullDate: "14 de enero de 2025, 16:30", method: "Autom\u00e1tico", category: "Inversiones",
    reference: "INV-20250114-003",
    filterType: "Venta", filterAsset: "Inversiones",
  },
  {
    id: "4", icon: "\uD83D\uDCB3", title: "Compra con tarjeta", date: "14 Ene", day: 14, month: 0, year: 2025,
    amount: "- 1.200 ARS", isPositive: false, subtitle: "Cafeter\u00eda",
    fullDate: "14 de enero de 2025, 09:15", method: "Lemon Card", cardLast4: "4582", category: "Gastronom\u00eda",
    reference: "TXN-20250114-004",
    location: { name: "Bar La Esquina", address: "Av. Corrientes 3820, CABA", lat: -34.6037, lng: -58.4116 },
    filterType: "Tarjeta", filterAsset: "Pesos",
  },
  {
    id: "5", icon: "\uD83C\uDFE6", title: "Dep\u00f3sito ahorro", date: "13 Ene", day: 13, month: 0, year: 2025,
    amount: "+ 500,00 USD", isPositive: true,
    fullDate: "13 de enero de 2025, 11:00", method: "Transferencia", category: "Ahorro USD",
    reference: "DEP-20250113-005",
    filterType: "Dep\u00f3sito", filterAsset: "D\u00f3lares",
  },
  {
    id: "6", icon: "\uD83D\uDD04", title: "Cambio de moneda", date: "12 Ene", day: 12, month: 0, year: 2025,
    amount: "100 USD > ARS", isPositive: true, subtitle: "Cotizaci\u00f3n: 1.050",
    fullDate: "12 de enero de 2025, 14:22", method: "In-app", category: "Cambio",
    reference: "SWP-20250112-006",
    filterType: "Compra", filterAsset: "D\u00f3lares",
  },
  {
    id: "11", icon: "\uD83D\uDCF1", title: "Pago QR", date: "11 Ene", day: 11, month: 0, year: 2025,
    amount: "- 850 ARS", isPositive: false, subtitle: "Kiosco",
    fullDate: "11 de enero de 2025, 13:20", method: "QR", category: "Compras",
    reference: "QR-20250111-011",
    filterType: "QR", filterAsset: "Pesos",
  },
  {
    id: "7", icon: "\uD83D\uDED2", title: "Compra con tarjeta", date: "8 Ene", day: 8, month: 0, year: 2025,
    amount: "- 3.500 ARS", isPositive: false, subtitle: "Supermercado",
    fullDate: "8 de enero de 2025, 18:45", method: "Lemon Card", cardLast4: "4582", category: "Supermercado",
    reference: "TXN-20250108-007",
    location: { name: "D\u00eda %", address: "Av. Santa Fe 2100, CABA", lat: -34.5955, lng: -58.3977 },
    filterType: "Tarjeta", filterAsset: "Pesos",
  },
  {
    id: "12", icon: "\u20BF", title: "Compra Bitcoin", date: "7 Ene", day: 7, month: 0, year: 2025,
    amount: "- 200 USD", isPositive: false, subtitle: "0,0035 BTC",
    fullDate: "7 de enero de 2025, 17:00", method: "In-app", category: "Crypto",
    reference: "BTC-20250107-012",
    filterType: "Compra", filterAsset: "Bitcoin y Crypto",
  },
  {
    id: "13", icon: "\uD83D\uDCF1", title: "Pago QR", date: "6 Ene", day: 6, month: 0, year: 2025,
    amount: "- 1.100 ARS", isPositive: false, subtitle: "Farmacia",
    fullDate: "6 de enero de 2025, 10:15", method: "QR", category: "Salud",
    reference: "QR-20250106-013",
    filterType: "QR", filterAsset: "Pesos",
  },
  {
    id: "8", icon: "\uD83C\uDDE6\uD83C\uDDF7", title: "Rendimientos", date: "5 Ene", day: 5, month: 0, year: 2025,
    amount: "+ 8,42 ARS", isPositive: true, subtitle: "25,99%",
    fullDate: "5 de enero de 2025, 00:00", method: "Autom\u00e1tico", category: "Rendimientos",
    reference: "RND-20250105-008",
    filterType: "Dep\u00f3sito", filterAsset: "Pesos",
  },
  {
    id: "9", icon: "\uD83D\uDCB3", title: "Compra con tarjeta", date: "3 Ene", day: 3, month: 0, year: 2025,
    amount: "- 950 ARS", isPositive: false, subtitle: "Cuervo Caf\u00e9",
    fullDate: "3 de enero de 2025, 10:32", method: "Lemon Card", cardLast4: "4582", category: "Gastronom\u00eda",
    reference: "TXN-20250103-009",
    location: { name: "Cuervo Caf\u00e9", address: "Thames 640, Palermo, CABA", lat: -34.5917, lng: -58.4253 },
    filterType: "Tarjeta", filterAsset: "Pesos",
  },
  {
    id: "14", icon: "\u2197\uFE0F", title: "Retiro a cuenta", date: "2 Ene", day: 2, month: 0, year: 2025,
    amount: "- 20.000 ARS", isPositive: false,
    fullDate: "2 de enero de 2025, 12:00", method: "Transferencia bancaria", category: "Retiro",
    reference: "RET-20250102-014",
    filterType: "Retiro", filterAsset: "Pesos",
  },
  {
    id: "10", icon: "\uD83C\uDFE6", title: "Dep\u00f3sito", date: "1 Ene", day: 1, month: 0, year: 2025,
    amount: "+ 50.000 ARS", isPositive: true,
    fullDate: "1 de enero de 2025, 08:00", method: "Transferencia bancaria", category: "Dep\u00f3sito",
    reference: "DEP-20250101-010",
    filterType: "Dep\u00f3sito", filterAsset: "Pesos",
  },
]

// ── Filter logic ──────────────────────────────────────────────
function applyFilters(items: ActivityItem[], active: Set<FilterId>): ActivityItem[] {
  if (active.size === 0) return items

  const activeAssets = UNIFIED_FILTERS
    .filter((f) => f.kind === "asset" && active.has(f.id))
    .map((f) => f.id as AssetId)

  const activeTypes = UNIFIED_FILTERS
    .filter((f) => f.kind === "type" && active.has(f.id))
    .map((f) => f.id as TypeId)

  return items.filter((item) => {
    const assetOk = activeAssets.length === 0 || activeAssets.includes(item.filterAsset)
    const typeOk  = activeTypes.length === 0  || activeTypes.includes(item.filterType)
    return assetOk && typeOk
  })
}

// ── Calendar helpers ──────────────────────────────────────────
const WEEKDAYS = ["LUN", "MAR", "MI\u00C9", "JUE", "VIE", "S\u00C1B", "DOM"]
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function getActivityForDay(items: ActivityItem[], day: number, month: number, year: number) {
  return items.filter((item) => item.day === day && item.month === month && item.year === year)
}

type ViewMode = "list" | "calendar"

// ── Main component ────────────────────────────────────────────
export default function ActivityScreen() {
  const [view, setView] = useState<ViewMode>("list")
  const [calMonth, setCalMonth] = useState(0)
  const [calYear, setCalYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set())

  const toggleFilter = (id: FilterId) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = applyFilters(activityData, activeFilters)

  const calendarDays = getCalendarDays(calYear, calMonth)
  const today = new Date()
  const isCurrentMonth = today.getMonth() === calMonth && today.getFullYear() === calYear

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) }
    else setCalMonth(calMonth - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) }
    else setCalMonth(calMonth + 1)
    setSelectedDay(null)
  }

  const selectedDayItems = selectedDay !== null
    ? getActivityForDay(filtered, selectedDay, calMonth, calYear)
    : []

  const handleOpenDetail = (item: TransactionDetail) => {
    setSelectedTx(item)
    setShowDetail(true)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setTimeout(() => setSelectedTx(null), 300)
  }

  return (
    <div className="flex flex-col h-full px-4 pt-2">
      <div className="w-full max-w-[320px] mx-auto flex flex-col flex-1">

        {/* Header with view toggle */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-bold" style={{ color: "#1c1c1a" }}>Actividad</h1>
          <div
            className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <button
              onClick={() => setView("list")}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
              style={{
                background: view === "list" ? "rgba(28,28,26,0.12)" : "transparent",
                color: view === "list" ? "#1c1c1a" : "rgba(28,28,26,0.35)",
              }}
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setView("calendar")}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
              style={{
                background: view === "calendar" ? "rgba(28,28,26,0.12)" : "transparent",
                color: view === "calendar" ? "#1c1c1a" : "rgba(28,28,26,0.35)",
              }}
            >
              <CalendarDays className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Unified filter chips ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide mb-3">
          {UNIFIED_FILTERS.map((f) => {
            const isActive = activeFilters.has(f.id)
            return (
              <button
                key={f.id}
                onClick={() => toggleFilter(f.id)}
                className="flex-shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
                style={{
                  background: isActive ? "rgba(28,28,26,0.12)" : "rgba(28,28,26,0.06)",
                  color: isActive ? "#1c1c1a" : "rgba(28,28,26,0.40)",
                  boxShadow: isActive ? "0 1px 4px rgba(28,28,26,0.08)" : "none",
                }}
              >
                {f.id}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto pb-4"
            >
              {filtered.length === 0 ? (
                <p className="text-[14px] py-8 text-center" style={{ color: "rgba(28,28,26,0.35)" }}>
                  Sin movimientos
                </p>
              ) : (
                filtered.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    onClick={() => handleOpenDetail(item)}
                    className="flex items-center justify-between py-3 w-full text-left active:opacity-60 transition-opacity"
                    style={{ borderBottom: "1px solid rgba(28,28,26,0.05)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 flex items-center justify-center text-base rounded-full"
                        style={{ background: "rgba(28,28,26,0.04)" }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium" style={{ color: "#1c1c1a" }}>{item.title}</p>
                        <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.35)" }}>{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[14px] font-bold tabular-nums"
                        style={{ color: item.isPositive ? "#1c1c1a" : "rgba(28,28,26,0.4)" }}
                      >
                        {item.amount}
                      </p>
                      {item.subtitle && (
                        <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.35)" }}>{item.subtitle}</p>
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto pb-4"
            >
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
                  style={{ background: "rgba(28,28,26,0.04)" }}
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: "rgba(28,28,26,0.5)" }} />
                </button>
                <span className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
                  style={{ background: "rgba(28,28,26,0.04)" }}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "rgba(28,28,26,0.5)" }} />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="flex items-center justify-center h-7">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(28,28,26,0.3)" }}>
                      {d}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />
                  const dayItems = getActivityForDay(filtered, day, calMonth, calYear)
                  const hasActivity = dayItems.length > 0
                  const isToday = isCurrentMonth && day === today.getDate()
                  const isSelected = selectedDay === day
                  const hasExpense = dayItems.some((d) => !d.isPositive)

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className="relative flex flex-col items-center justify-center rounded-xl aspect-square transition-all active:scale-95"
                      style={{
                        background: isSelected
                          ? "#1c1c1a"
                          : hasActivity
                            ? "#e5e4e1"
                            : "rgba(28,28,26,0.03)",
                      }}
                    >
                      {hasActivity && (
                        <span className="text-[14px] leading-none mb-0.5">{dayItems[0].icon}</span>
                      )}
                      <span
                        className="text-[11px] tabular-nums"
                        style={{
                          color: isSelected ? "#f5f4f1" : isToday ? "#1c1c1a" : "rgba(28,28,26,0.55)",
                          fontWeight: isToday ? 700 : 500,
                        }}
                      >
                        {day}
                      </span>
                      {hasActivity && !isSelected && (
                        <div
                          className="absolute top-1 right-1 w-[5px] h-[5px] rounded-full"
                          style={{ background: hasExpense ? "#E63946" : "#446e0c" }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Selected day transactions */}
              <AnimatePresence>
                {selectedDay !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="px-1">
                      <p className="text-[12px] font-semibold mb-2" style={{ color: "rgba(28,28,26,0.4)" }}>
                        {selectedDay} de {MONTH_NAMES[calMonth]}
                      </p>
                      {selectedDayItems.length === 0 ? (
                        <p className="text-[13px] py-2" style={{ color: "rgba(28,28,26,0.35)" }}>
                          Sin movimientos
                        </p>
                      ) : (
                        selectedDayItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleOpenDetail(item)}
                            className="flex items-center justify-between py-2.5 w-full text-left active:opacity-60 transition-opacity"
                            style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 flex items-center justify-center text-sm rounded-full">
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-[13px] font-medium" style={{ color: "#1c1c1a" }}>{item.title}</p>
                                {item.subtitle && (
                                  <p className="text-[11px]" style={{ color: "rgba(28,28,26,0.35)" }}>{item.subtitle}</p>
                                )}
                              </div>
                            </div>
                            <p
                              className="text-[13px] font-bold tabular-nums"
                              style={{ color: item.isPositive ? "#1c1c1a" : "rgba(28,28,26,0.4)" }}
                            >
                              {item.amount}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction detail bottom sheet */}
      <TransactionDetailSheet
        open={showDetail}
        transaction={selectedTx}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
