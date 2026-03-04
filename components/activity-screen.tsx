"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import TransactionDetailSheet, { type TransactionDetail } from "./transaction-detail-sheet"

interface ActivityItem extends TransactionDetail {
  day: number
  month: number
  year: number
}

const activityData: ActivityItem[] = [
  {
    id: "1", icon: "\uD83C\uDDE6\uD83C\uDDF7", title: "Rendimientos", date: "15 Ene", day: 15, month: 0, year: 2025,
    amount: "+ 10,11 ARS", isPositive: true, subtitle: "25,99%",
    fullDate: "15 de enero de 2025, 00:00", method: "Autom\u00E1tico", category: "Rendimientos",
    reference: "RND-20250115-001",
  },
  {
    id: "2", icon: "\uD83D\uDCB5", title: "Ganancias diarias", date: "15 Ene", day: 15, month: 0, year: 2025,
    amount: "+ 0,17 USDC", isPositive: true, subtitle: "247,11 ARS",
    fullDate: "15 de enero de 2025, 00:00", method: "Autom\u00E1tico", category: "Rendimientos USDC",
    reference: "YLD-20250115-002",
  },
  {
    id: "3", icon: "\uD83D\uDCC8", title: "Ganancia inversi\u00F3n", date: "14 Ene", day: 14, month: 0, year: 2025,
    amount: "+ 45,00 USD", isPositive: true, subtitle: "+2,3%",
    fullDate: "14 de enero de 2025, 16:30", method: "Autom\u00E1tico", category: "Inversiones",
    reference: "INV-20250114-003",
  },
  {
    id: "4", icon: "\uD83D\uDCB3", title: "Compra con tarjeta", date: "14 Ene", day: 14, month: 0, year: 2025,
    amount: "- 1.200 ARS", isPositive: false, subtitle: "Cafeter\u00EDa",
    fullDate: "14 de enero de 2025, 09:15", method: "Lemon Card", cardLast4: "4582", category: "Gastronom\u00EDa",
    reference: "TXN-20250114-004",
    location: { name: "Bar La Esquina", address: "Av. Corrientes 3820, CABA", lat: -34.6037, lng: -58.4116 },
  },
  {
    id: "5", icon: "\uD83C\uDFE6", title: "Dep\u00F3sito ahorro", date: "13 Ene", day: 13, month: 0, year: 2025,
    amount: "+ 500,00 USD", isPositive: true,
    fullDate: "13 de enero de 2025, 11:00", method: "Transferencia", category: "Ahorro USD",
    reference: "DEP-20250113-005",
  },
  {
    id: "6", icon: "\uD83D\uDD04", title: "Cambio de moneda", date: "12 Ene", day: 12, month: 0, year: 2025,
    amount: "100 USD > ARS", isPositive: true, subtitle: "Cotizaci\u00F3n: 1.050",
    fullDate: "12 de enero de 2025, 14:22", method: "In-app", category: "Cambio",
    reference: "SWP-20250112-006",
  },
  {
    id: "7", icon: "\uD83D\uDED2", title: "Compra con tarjeta", date: "8 Ene", day: 8, month: 0, year: 2025,
    amount: "- 3.500 ARS", isPositive: false, subtitle: "Supermercado",
    fullDate: "8 de enero de 2025, 18:45", method: "Lemon Card", cardLast4: "4582", category: "Supermercado",
    reference: "TXN-20250108-007",
    location: { name: "D\u00EDa %", address: "Av. Santa Fe 2100, CABA", lat: -34.5955, lng: -58.3977 },
  },
  {
    id: "8", icon: "\uD83C\uDDE6\uD83C\uDDF7", title: "Rendimientos", date: "5 Ene", day: 5, month: 0, year: 2025,
    amount: "+ 8,42 ARS", isPositive: true, subtitle: "25,99%",
    fullDate: "5 de enero de 2025, 00:00", method: "Autom\u00E1tico", category: "Rendimientos",
    reference: "RND-20250105-008",
  },
  {
    id: "9", icon: "\uD83D\uDCB3", title: "Compra con tarjeta", date: "3 Ene", day: 3, month: 0, year: 2025,
    amount: "- 950 ARS", isPositive: false, subtitle: "Cuervo Caf\u00E9",
    fullDate: "3 de enero de 2025, 10:32", method: "Lemon Card", cardLast4: "4582", category: "Gastronom\u00EDa",
    reference: "TXN-20250103-009",
    location: { name: "Cuervo Caf\u00E9", address: "Thames 640, Palermo, CABA", lat: -34.5917, lng: -58.4253 },
  },
  {
    id: "10", icon: "\uD83C\uDFE6", title: "Dep\u00F3sito", date: "1 Ene", day: 1, month: 0, year: 2025,
    amount: "+ 50.000 ARS", isPositive: true,
    fullDate: "1 de enero de 2025, 08:00", method: "Transferencia bancaria", category: "Dep\u00F3sito",
    reference: "DEP-20250101-010",
  },
]

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

function getActivityForDay(day: number, month: number, year: number) {
  return activityData.filter(
    (item) => item.day === day && item.month === month && item.year === year
  )
}

type ViewMode = "list" | "calendar"

export default function ActivityScreen() {
  const [view, setView] = useState<ViewMode>("list")
  const [calMonth, setCalMonth] = useState(0)
  const [calYear, setCalYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null)
  const [showDetail, setShowDetail] = useState(false)

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
    ? getActivityForDay(selectedDay, calMonth, calYear)
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
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>Actividad</h1>
          <div
            className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <button
              onClick={() => setView("list")}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
              style={{
                background: view === "list" ? "#1c1c1a" : "transparent",
                color: view === "list" ? "#f5f4f1" : "rgba(28,28,26,0.35)",
              }}
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setView("calendar")}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
              style={{
                background: view === "calendar" ? "#1c1c1a" : "transparent",
                color: view === "calendar" ? "#f5f4f1" : "rgba(28,28,26,0.35)",
              }}
            >
              <CalendarDays className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
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
              {activityData.map((item, index) => (
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
              ))}
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

                  const dayItems = getActivityForDay(day, calMonth, calYear)
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
                        <span className="text-[14px] leading-none mb-0.5">
                          {dayItems[0].icon}
                        </span>
                      )}
                      <span
                        className="text-[11px] font-medium tabular-nums"
                        style={{
                          color: isSelected
                            ? "#f5f4f1"
                            : isToday
                              ? "#1c1c1a"
                              : "rgba(28,28,26,0.55)",
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
                              <div
                                className="w-8 h-8 flex items-center justify-center text-sm rounded-full"
                              >
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
