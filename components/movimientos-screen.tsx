"use client"

import { useState } from "react"
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react"

type TipoMovimiento = "todos" | "ingresos" | "egresos"

interface Movimiento {
  id: number
  tipo: "ingreso" | "egreso"
  descripcion: string
  detalle: string
  fecha: string
  monto: string
  montoNum: number
}

const MOVIMIENTOS: Movimiento[] = [
  { id: 1, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "5 Mar 2026", monto: "+$1.490,00", montoNum: 1490 },
  { id: 2, tipo: "ingreso", descripcion: "Deposito recibido", detalle: "Transferencia bancaria", fecha: "4 Mar 2026", monto: "+$85.000,00", montoNum: 85000 },
  { id: 3, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "4 Mar 2026", monto: "+$1.520,00", montoNum: 1520 },
  { id: 4, tipo: "egreso", descripcion: "Pago con QR", detalle: "Cafe Martinez", fecha: "4 Mar 2026", monto: "-$4.200,00", montoNum: -4200 },
  { id: 5, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "3 Mar 2026", monto: "+$1.460,00", montoNum: 1460 },
  { id: 6, tipo: "egreso", descripcion: "Transferencia enviada", detalle: "A Juan Perez", fecha: "3 Mar 2026", monto: "-$32.500,00", montoNum: -32500 },
  { id: 7, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "2 Mar 2026", monto: "+$1.410,00", montoNum: 1410 },
  { id: 8, tipo: "egreso", descripcion: "Pago tarjeta debito", detalle: "Mercado Libre", fecha: "2 Mar 2026", monto: "-$18.900,00", montoNum: -18900 },
  { id: 9, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "1 Mar 2026", monto: "+$1.390,00", montoNum: 1390 },
  { id: 10, tipo: "egreso", descripcion: "Pago de servicio", detalle: "Edenor - Electricidad", fecha: "1 Mar 2026", monto: "-$22.300,00", montoNum: -22300 },
  { id: 11, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "28 Feb 2026", monto: "+$1.480,00", montoNum: 1480 },
  { id: 12, tipo: "ingreso", descripcion: "Deposito recibido", detalle: "Transferencia bancaria", fecha: "28 Feb 2026", monto: "+$125.000,00", montoNum: 125000 },
  { id: 13, tipo: "egreso", descripcion: "Transferencia enviada", detalle: "A Maria Lopez", fecha: "28 Feb 2026", monto: "-$15.000,00", montoNum: -15000 },
  { id: 14, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "27 Feb 2026", monto: "+$1.500,00", montoNum: 1500 },
  { id: 15, tipo: "egreso", descripcion: "Pago con QR", detalle: "Farmacia del Pueblo", fecha: "27 Feb 2026", monto: "-$8.450,00", montoNum: -8450 },
  { id: 16, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "26 Feb 2026", monto: "+$1.380,00", montoNum: 1380 },
  { id: 17, tipo: "egreso", descripcion: "Pago tarjeta debito", detalle: "Carrefour", fecha: "26 Feb 2026", monto: "-$34.200,00", montoNum: -34200 },
  { id: 18, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "25 Feb 2026", monto: "+$1.380,00", montoNum: 1380 },
  { id: 19, tipo: "egreso", descripcion: "Pago de servicio", detalle: "Personal - Celular", fecha: "25 Feb 2026", monto: "-$12.800,00", montoNum: -12800 },
  { id: 20, tipo: "egreso", descripcion: "Transferencia enviada", detalle: "A Pedro Garcia", fecha: "25 Feb 2026", monto: "-$50.000,00", montoNum: -50000 },
  { id: 21, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "24 Feb 2026", monto: "+$1.350,00", montoNum: 1350 },
  { id: 22, tipo: "egreso", descripcion: "Pago con QR", detalle: "Rappi - Delivery", fecha: "24 Feb 2026", monto: "-$9.700,00", montoNum: -9700 },
  { id: 23, tipo: "ingreso", descripcion: "Rendimiento diario", detalle: "sARS 29,5% TNA", fecha: "23 Feb 2026", monto: "+$1.350,00", montoNum: 1350 },
  { id: 24, tipo: "ingreso", descripcion: "Deposito recibido", detalle: "Transferencia bancaria", fecha: "23 Feb 2026", monto: "+$200.000,00", montoNum: 200000 },
  { id: 25, tipo: "egreso", descripcion: "Pago tarjeta debito", detalle: "YPF - Combustible", fecha: "23 Feb 2026", monto: "-$28.500,00", montoNum: -28500 },
]

export default function MovimientosScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<TipoMovimiento>("todos")
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const filtered = MOVIMIENTOS.filter((m) => {
    if (filter === "ingresos" && m.tipo !== "ingreso") return false
    if (filter === "egresos" && m.tipo !== "egreso") return false
    if (search) {
      const q = search.toLowerCase()
      return (
        m.descripcion.toLowerCase().includes(q) ||
        m.detalle.toLowerCase().includes(q)
      )
    }
    return true
  })

  const grouped = filtered.reduce<Record<string, Movimiento[]>>((acc, m) => {
    if (!acc[m.fecha]) acc[m.fecha] = []
    acc[m.fecha].push(m)
    return acc
  }, {})

  const filterOptions: { value: TipoMovimiento; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "ingresos", label: "Ingresos" },
    { value: "egresos", label: "Egresos" },
  ]

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-bold text-foreground">Movimientos</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
        </div>

        {showSearch && (
          <div className="mt-3">
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar movimiento..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Limpiar busqueda">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 flex rounded-full bg-secondary p-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
                filter === opt.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col px-5 pb-8">
        {Object.entries(grouped).map(([fecha, movs]) => (
          <div key={fecha} className="mt-4 first:mt-0">
            <p className="bg-background pb-2 text-xs font-semibold text-muted-foreground">
              {fecha}
            </p>
            <div className="flex flex-col gap-1.5">
              {movs.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center gap-4 rounded-xl bg-card px-4 py-3.5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    {mov.tipo === "ingreso" ? (
                      <ArrowDownLeft className="h-5 w-5 text-foreground" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium text-foreground">{mov.descripcion}</p>
                    <p className="text-xs text-muted-foreground">{mov.detalle}</p>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      mov.tipo === "ingreso" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {mov.monto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 pt-16">
            <SlidersHorizontal className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              No se encontraron movimientos
            </p>
            <p className="text-xs text-muted-foreground/70">
              Proba con otro filtro o busqueda
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
