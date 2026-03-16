"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const monthlyData = [
  { month: "Mar", earnings: 8.12 },
  { month: "Abr", earnings: 8.45 },
  { month: "May", earnings: 8.78 },
  { month: "Jun", earnings: 9.02 },
  { month: "Jul", earnings: 9.34 },
  { month: "Ago", earnings: 9.65 },
  { month: "Sep", earnings: 9.89 },
  { month: "Oct", earnings: 10.21 },
  { month: "Nov", earnings: 10.54 },
  { month: "Dic", earnings: 10.89 },
  { month: "Ene", earnings: 11.23 },
  { month: "Feb", earnings: 11.58 },
]

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
      <p className="text-sm font-bold text-background">${payload[0].value.toFixed(2)}</p>
    </div>
  )
}

export function UsdMonthlyEarningsChart() {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#6b6961" }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#6b6961" }}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(28,28,26,0.07)" }}
          />
          <Bar dataKey="earnings" fill="#1c1c1a" fillOpacity={0.35} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
