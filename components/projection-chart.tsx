"use client"

import { DollarSign, Plus } from "lucide-react"
import {
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
  Tooltip,
} from "recharts"

interface ProjectionChartProps {
  principal: number
  rate: number
  years: number
  monthlyContribution?: number
  showTooltip?: boolean
}

interface ChartDataPoint {
  year: string
  yearNum: number
  withYield: number
  withoutYield: number
  added: number
  earned: number
}

function generateProjectionData(
  principal: number,
  rate: number,
  years: number,
  monthlyContribution: number = 0
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const monthlyRate = rate / 12

  for (let year = 0; year <= years; year += 5) {
    const months = year * 12

    let withYield = principal * Math.pow(1 + rate, year)
    if (monthlyContribution > 0 && months > 0) {
      withYield += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    }

    const withoutYield = principal + monthlyContribution * months
    const earned = withYield - withoutYield

    data.push({
      year: year === 0 ? "Hoy" : `${year}A`,
      yearNum: year,
      withYield: Math.round(withYield),
      withoutYield: Math.round(withoutYield),
      added: Math.round(withoutYield),
      earned: Math.round(earned),
    })
  }

  return data
}

function formatYAxis(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

function formatCurrency(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(2).replace(".", ",")}k`
  return `$${value.toLocaleString("es-AR")}`
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: ChartDataPoint }[]
}) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-xl bg-foreground px-3 py-2.5 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#247BA0]">
          <DollarSign className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs text-muted-foreground">Depositado</span>
        <span className="text-sm font-semibold text-background">
          {formatCurrency(data.added)}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2D936C]">
          <Plus className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs text-muted-foreground">Generado</span>
        <span className="text-sm font-semibold text-background">
          {formatCurrency(data.earned)}
        </span>
      </div>
    </div>
  )
}

export function ProjectionChart({
  principal,
  rate,
  years,
  monthlyContribution = 0,
  showTooltip = true,
}: ProjectionChartProps) {
  const data = generateProjectionData(principal, rate, years, monthlyContribution)

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1c1a" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#1c1c1a" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b6961" }}
            dy={5}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#6b6961" }}
            tickFormatter={formatYAxis}
            width={45}
          />
          {showTooltip && (
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#d9d9d9", strokeDasharray: "4 4" }}
            />
          )}
          <Line
            type="monotone"
            dataKey="withoutYield"
            stroke="#d9d9d9"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="withYield"
            stroke="#1c1c1a"
            strokeWidth={2.5}
            fill="url(#yieldGradient)"
            dot={false}
            activeDot={{ r: 6, fill: "#1c1c1a", stroke: "#e5e4e1", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
