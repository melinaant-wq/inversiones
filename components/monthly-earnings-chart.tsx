"use client"

import { useState, useEffect } from "react"
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type Period = "dia" | "mes" | "ano"

const dataByPeriod: Record<Period, { label: string; earnings: number }[]> = {
  dia: [
    { label: "27 Feb", earnings: 1500 },
    { label: "28 Feb", earnings: 1480 },
    { label: "1 Mar", earnings: 1390 },
    { label: "2 Mar", earnings: 1410 },
    { label: "3 Mar", earnings: 1460 },
    { label: "4 Mar", earnings: 1520 },
    { label: "5 Mar", earnings: 1490 },
  ],
  mes: [
    { label: "Abr", earnings: 30200 },
    { label: "May", earnings: 31500 },
    { label: "Jun", earnings: 32800 },
    { label: "Jul", earnings: 33600 },
    { label: "Ago", earnings: 34900 },
    { label: "Sep", earnings: 35200 },
    { label: "Oct", earnings: 36800 },
    { label: "Nov", earnings: 38100 },
    { label: "Dic", earnings: 39500 },
    { label: "Ene", earnings: 40200 },
    { label: "Feb", earnings: 41300 },
    { label: "Mar", earnings: 14800 },
  ],
  ano: [
    { label: "2015", earnings: 98000 },
    { label: "2016", earnings: 115000 },
    { label: "2017", earnings: 132000 },
    { label: "2018", earnings: 148000 },
    { label: "2019", earnings: 165000 },
    { label: "2020", earnings: 189000 },
    { label: "2021", earnings: 215000 },
    { label: "2022", earnings: 248000 },
    { label: "2023", earnings: 285000 },
    { label: "2024", earnings: 320000 },
    { label: "2025", earnings: 415000 },
    { label: "2026", earnings: 147500 },
  ],
}

const periodLabels: Record<Period, string> = {
  dia: "Diario",
  mes: "Mensual",
  ano: "Anual",
}

const periodAccumulatedLabels: Record<Period, string> = {
  dia: "Ganancia acumulada semanal",
  mes: "Ultimos 12 meses",
  ano: "Ultimos 12 anos",
}

const tnaByPeriod: Record<Period, number[]> = {
  dia: [29.8, 29.5, 29.3, 29.4, 29.5, 29.7, 29.5],
  mes: [28.2, 28.5, 28.8, 29.0, 29.1, 29.2, 29.3, 29.4, 29.5, 29.5, 29.5, 29.5],
  ano: [22.0, 23.5, 24.0, 24.5, 25.0, 25.8, 26.5, 27.0, 27.8, 28.5, 29.0, 29.5],
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-foreground px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-background">
        ${payload[0].value.toLocaleString("es-AR")}
      </p>
    </div>
  )
}

export { periodLabels, periodAccumulatedLabels }
export type { Period }

export function MonthlyEarningsChart({
  period,
  onPeriodChange,
}: {
  period: Period
  onPeriodChange?: (total: number, label: string) => void
}) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null)
  const data = dataByPeriod[period]
  const tnaRates = tnaByPeriod[period]

  useEffect(() => {
    const total = data.reduce((sum, d) => sum + d.earnings, 0)
    onPeriodChange?.(total, periodAccumulatedLabels[period])
    setSelectedBar(null)
  }, [period, data, onPeriodChange])

  return (
    <div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, left: -10, bottom: 0 }}
            onClick={(state) => {
              if (state?.activeTooltipIndex !== undefined) {
                setSelectedBar(
                  state.activeTooltipIndex === selectedBar
                    ? null
                    : state.activeTooltipIndex
                )
              }
            }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b6961" }}
              dy={6}
              interval={1}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b6961" }}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(28,28,26,0.07)" }}
            />
            <Bar dataKey="earnings" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === selectedBar ? "var(--accent-lime)" : "#1c1c1a"}
                  fillOpacity={i === selectedBar ? 1 : 0.35}
                  className="cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedBar !== null && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">{data[selectedBar].label}</p>
            <p className="text-sm font-bold text-foreground">
              ${data[selectedBar].earnings.toLocaleString("es-AR")}
            </p>
          </div>
          <div className="rounded-full bg-accent-lime px-3 py-1.5">
            <p className="text-xs font-bold text-accent-lime-foreground">
              TNA {tnaRates[selectedBar].toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
