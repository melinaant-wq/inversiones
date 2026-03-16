"use client"

import { useState, useEffect, useRef } from "react"
import { MorphIcon } from '@/components/ui/morph-icon'

interface FincraftScreenProps {
  onClose: () => void
}

interface Villager {
  x: number
  y: number
  targetX: number
  targetY: number
  frame: number
  zone: string
  color: string
}

const ACCOUNTS = [
  { key: "cash", label: "ARSs", value: 4000000, emoji: "castle", color: "#ddf74c" },
  { key: "crypto", label: "Crypto", value: 5500, emoji: "mine", color: "#A78BFA" },
  { key: "stocks", label: "Stocks", value: 5000, emoji: "market", color: "#ddf74a" },
  { key: "dollars", label: "Dollars", value: 1300, emoji: "field", color: "#60D394" },
  { key: "cards", label: "Cards", value: 200, emoji: "tavern", color: "#F97316" },
]

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  stroke?: string
) {
  ctx.fillStyle = fill
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w) - 1, Math.floor(h) - 1)
  }
}

function drawCastle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size
  // Main body
  drawPixelRect(ctx, x - s * 0.35, y - s * 0.5, s * 0.7, s * 0.5, "#D4C896", "#8B7D3C")
  // Left tower
  drawPixelRect(ctx, x - s * 0.4, y - s * 0.75, s * 0.2, s * 0.75, "#C8BC84", "#8B7D3C")
  // Right tower
  drawPixelRect(ctx, x + s * 0.2, y - s * 0.75, s * 0.2, s * 0.75, "#C8BC84", "#8B7D3C")
  // Tower tops (triangles)
  ctx.fillStyle = "#E63946"
  ctx.beginPath()
  ctx.moveTo(x - s * 0.45, y - s * 0.75)
  ctx.lineTo(x - s * 0.3, y - s * 0.95)
  ctx.lineTo(x - s * 0.15, y - s * 0.75)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x + s * 0.15, y - s * 0.75)
  ctx.lineTo(x + s * 0.3, y - s * 0.95)
  ctx.lineTo(x + s * 0.45, y - s * 0.75)
  ctx.fill()
  // Gate
  drawPixelRect(ctx, x - s * 0.08, y - s * 0.2, s * 0.16, s * 0.2, "#4A3728")
  // Windows
  drawPixelRect(ctx, x - s * 0.2, y - s * 0.4, s * 0.08, s * 0.08, "#ddf74a")
  drawPixelRect(ctx, x + s * 0.12, y - s * 0.4, s * 0.08, s * 0.08, "#ddf74a")
  // Flag
  ctx.fillStyle = "#ddf74c"
  ctx.fillRect(x - s * 0.29, y - s * 1.05, 2, s * 0.12)
  ctx.fillRect(x - s * 0.27, y - s * 1.05, s * 0.1, s * 0.06)
}

function drawMine(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size
  // Mountain
  ctx.fillStyle = "#6B6B6B"
  ctx.beginPath()
  ctx.moveTo(x - s * 0.4, y)
  ctx.lineTo(x, y - s * 0.65)
  ctx.lineTo(x + s * 0.4, y)
  ctx.fill()
  // Snow cap
  ctx.fillStyle = "#E8E8E8"
  ctx.beginPath()
  ctx.moveTo(x - s * 0.1, y - s * 0.5)
  ctx.lineTo(x, y - s * 0.65)
  ctx.lineTo(x + s * 0.1, y - s * 0.5)
  ctx.fill()
  // Mine entrance
  drawPixelRect(ctx, x - s * 0.1, y - s * 0.15, s * 0.2, s * 0.15, "#2A1F1A")
  // Crystals
  ctx.fillStyle = "#A78BFA"
  ctx.fillRect(x + s * 0.12, y - s * 0.35, 3, 5)
  ctx.fillRect(x + s * 0.18, y - s * 0.38, 3, 7)
  ctx.fillStyle = "#C4B5FD"
  ctx.fillRect(x - s * 0.18, y - s * 0.3, 2, 4)
}

function drawMarket(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size
  // Building
  drawPixelRect(ctx, x - s * 0.3, y - s * 0.35, s * 0.6, s * 0.35, "#F5E6C8", "#8B7D3C")
  // Roof
  ctx.fillStyle = "#ddf74a"
  ctx.beginPath()
  ctx.moveTo(x - s * 0.38, y - s * 0.35)
  ctx.lineTo(x, y - s * 0.6)
  ctx.lineTo(x + s * 0.38, y - s * 0.35)
  ctx.fill()
  ctx.strokeStyle = "#B8A000"
  ctx.lineWidth = 1
  ctx.stroke()
  // Door
  drawPixelRect(ctx, x - s * 0.06, y - s * 0.15, s * 0.12, s * 0.15, "#6B4423")
  // Sign
  drawPixelRect(ctx, x + s * 0.1, y - s * 0.28, s * 0.12, s * 0.08, "#ddf74a", "#1c1c1a")
  // Stall awning stripes
  ctx.fillStyle = "#E63946"
  ctx.fillRect(x - s * 0.35, y - s * 0.36, s * 0.14, 3)
  ctx.fillRect(x - s * 0.07, y - s * 0.36, s * 0.14, 3)
  ctx.fillRect(x + s * 0.21, y - s * 0.36, s * 0.14, 3)
}

function drawField(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size
  // Field ground
  drawPixelRect(ctx, x - s * 0.35, y - s * 0.08, s * 0.7, s * 0.08, "#8BC34A")
  // Crop rows
  for (let i = 0; i < 5; i++) {
    const cx = x - s * 0.28 + i * s * 0.14
    ctx.fillStyle = "#4CAF50"
    ctx.fillRect(cx, y - s * 0.25, 3, s * 0.17)
    ctx.fillStyle = "#66BB6A"
    ctx.fillRect(cx - 2, y - s * 0.28, 7, 4)
    ctx.fillRect(cx - 1, y - s * 0.32, 5, 4)
  }
  // Fence
  ctx.strokeStyle = "#8B7D3C"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x - s * 0.38, y - s * 0.1)
  ctx.lineTo(x + s * 0.38, y - s * 0.1)
  ctx.stroke()
  for (let i = 0; i < 4; i++) {
    const px = x - s * 0.35 + i * s * 0.23
    ctx.fillStyle = "#A09060"
    ctx.fillRect(px, y - s * 0.18, 2, s * 0.1)
  }
  // Dollar sign
  ctx.fillStyle = "#60D394"
  ctx.font = `bold ${Math.floor(s * 0.18)}px monospace`
  ctx.textAlign = "center"
  ctx.fillText("$", x, y - s * 0.35)
}

function drawTavern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size
  // Building
  drawPixelRect(ctx, x - s * 0.25, y - s * 0.3, s * 0.5, s * 0.3, "#D4A574", "#8B6D4A")
  // Roof
  drawPixelRect(ctx, x - s * 0.3, y - s * 0.38, s * 0.6, s * 0.1, "#8B4513")
  // Door
  drawPixelRect(ctx, x - s * 0.05, y - s * 0.12, s * 0.1, s * 0.12, "#4A2F1A")
  // Window glow
  drawPixelRect(ctx, x + s * 0.08, y - s * 0.22, s * 0.08, s * 0.06, "#FFE082")
  drawPixelRect(ctx, x - s * 0.18, y - s * 0.22, s * 0.08, s * 0.06, "#FFE082")
  // Card sign
  ctx.fillStyle = "#F97316"
  ctx.font = `bold ${Math.floor(s * 0.14)}px monospace`
  ctx.textAlign = "center"
  ctx.fillText("\u2660", x, y - s * 0.4)
}

function drawVillager(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  color: string
) {
  const bounce = frame % 2 === 0 ? 0 : -1
  // Body
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x) - 2, Math.floor(y) - 6 + bounce, 4, 5)
  // Head
  ctx.fillStyle = "#F5DEB3"
  ctx.fillRect(Math.floor(x) - 2, Math.floor(y) - 9 + bounce, 4, 3)
  // Legs
  const legOffset = frame % 2 === 0 ? 1 : -1
  ctx.fillStyle = "#1c1c1a"
  ctx.fillRect(Math.floor(x) - 2, Math.floor(y) - 1, 2, 2)
  ctx.fillRect(Math.floor(x) + legOffset, Math.floor(y) - 1, 2, 2)
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#6B4423"
  ctx.fillRect(x - 1, y - size * 0.4, 3, size * 0.4)
  ctx.fillStyle = "#4CAF50"
  ctx.beginPath()
  ctx.arc(x, y - size * 0.5, size * 0.25, 0, Math.PI * 2)
  ctx.fill()
}

export default function FincraftScreen({ onClose }: FincraftScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const villagersRef = useRef<Villager[]>([])
  const frameRef = useRef(0)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const totalValue = ACCOUNTS.reduce((sum, a) => sum + a.value, 0)

  useEffect(() => {
    // Initialize villagers
    const villagers: Villager[] = []
    for (const account of ACCOUNTS) {
      const count = account.key === "cash" ? 6 : account.key === "cards" ? 1 : 3
      for (let i = 0; i < count; i++) {
        villagers.push({
          x: 0, y: 0,
          targetX: 0, targetY: 0,
          frame: Math.floor(Math.random() * 4),
          zone: account.key,
          color: account.color,
        })
      }
    }
    villagersRef.current = villagers
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    // Define zone positions and sizes based on account values
    const zones: Record<string, { x: number; y: number; w: number; h: number; size: number }> = {
      cash:    { x: W * 0.5,  y: H * 0.22, w: W * 0.6,  h: H * 0.22, size: Math.min(W, H) * 0.22 },
      crypto:  { x: W * 0.22, y: H * 0.48, w: W * 0.35, h: H * 0.18, size: Math.min(W, H) * 0.14 },
      stocks:  { x: W * 0.72, y: H * 0.48, w: W * 0.35, h: H * 0.18, size: Math.min(W, H) * 0.13 },
      dollars: { x: W * 0.3,  y: H * 0.72, w: W * 0.35, h: H * 0.16, size: Math.min(W, H) * 0.12 },
      cards:   { x: W * 0.72, y: H * 0.72, w: W * 0.25, h: H * 0.14, size: Math.min(W, H) * 0.1 },
    }

    // Assign villager positions in their zones
    for (const v of villagersRef.current) {
      const zone = zones[v.zone]
      if (!zone) continue
      if (v.x === 0 && v.y === 0) {
        v.x = zone.x + (Math.random() - 0.5) * zone.w * 0.6
        v.y = zone.y + zone.size * 0.15 + Math.random() * 12
        v.targetX = v.x
        v.targetY = v.y
      }
    }

    let animId: number

    const render = () => {
      frameRef.current++
      ctx.imageSmoothingEnabled = false

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, "#E8F5E9")
      grad.addColorStop(0.4, "#F1F8E9")
      grad.addColorStop(1, "#f5f4f1")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Ground
      ctx.fillStyle = "#C5D89E"
      ctx.fillRect(0, H * 0.35, W, H * 0.65)

      // Path network (dirt roads connecting zones)
      ctx.strokeStyle = "#B8A87A"
      ctx.lineWidth = 4
      ctx.setLineDash([])
      // Main road
      ctx.beginPath()
      ctx.moveTo(W * 0.5, H * 0.32)
      ctx.lineTo(W * 0.5, H * 0.55)
      ctx.stroke()
      // Left branch
      ctx.beginPath()
      ctx.moveTo(W * 0.35, H * 0.55)
      ctx.lineTo(W * 0.22, H * 0.48)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(W * 0.22, H * 0.55)
      ctx.lineTo(W * 0.3, H * 0.68)
      ctx.stroke()
      // Right branch
      ctx.beginPath()
      ctx.moveTo(W * 0.6, H * 0.55)
      ctx.lineTo(W * 0.72, H * 0.48)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(W * 0.72, H * 0.55)
      ctx.lineTo(W * 0.72, H * 0.68)
      ctx.stroke()

      // Scattered trees
      const treePositions = [
        { x: W * 0.08, y: H * 0.42 }, { x: W * 0.92, y: H * 0.38 },
        { x: W * 0.15, y: H * 0.6 }, { x: W * 0.88, y: H * 0.62 },
        { x: W * 0.5, y: H * 0.85 }, { x: W * 0.05, y: H * 0.82 },
        { x: W * 0.95, y: H * 0.85 },
      ]
      for (const t of treePositions) {
        drawTree(ctx, t.x, t.y, 24)
      }

      // Draw buildings
      drawCastle(ctx, zones.cash.x, zones.cash.y + zones.cash.size * 0.1, zones.cash.size)
      drawMine(ctx, zones.crypto.x, zones.crypto.y + zones.crypto.size * 0.1, zones.crypto.size)
      drawMarket(ctx, zones.stocks.x, zones.stocks.y + zones.stocks.size * 0.1, zones.stocks.size)
      drawField(ctx, zones.dollars.x, zones.dollars.y + zones.dollars.size * 0.05, zones.dollars.size)
      drawTavern(ctx, zones.cards.x, zones.cards.y + zones.cards.size * 0.1, zones.cards.size)

      // Draw zone labels
      ctx.textAlign = "center"
      for (const account of ACCOUNTS) {
        const zone = zones[account.key]
        ctx.fillStyle = "rgba(28,28,26,0.5)"
        ctx.font = "bold 7px monospace"
        ctx.fillText(
          account.label.toUpperCase(),
          zone.x,
          zone.y + zone.size * 0.25 + 14
        )
        ctx.fillStyle = "#1c1c1a"
        ctx.font = "bold 8px monospace"
        ctx.fillText(
          account.key === "cash"
            ? `$${(account.value / 1000000).toFixed(1)}M`
            : `$${account.value.toLocaleString()}`,
          zone.x,
          zone.y + zone.size * 0.25 + 24
        )
      }

      // Update and draw villagers
      if (frameRef.current % 12 === 0) {
        for (const v of villagersRef.current) {
          v.frame++
          const zone = zones[v.zone]
          if (Math.abs(v.x - v.targetX) < 2 && Math.abs(v.y - v.targetY) < 2) {
            v.targetX = zone.x + (Math.random() - 0.5) * zone.w * 0.5
            v.targetY = zone.y + zone.size * 0.1 + Math.random() * 14
          }
        }
      }

      for (const v of villagersRef.current) {
        v.x += (v.targetX - v.x) * 0.02
        v.y += (v.targetY - v.y) * 0.02
        drawVillager(ctx, v.x, v.y, v.frame, v.color)
      }

      // Highlight selected zone
      if (selectedZone) {
        const zone = zones[selectedZone]
        ctx.strokeStyle = "#1c1c1a"
        ctx.lineWidth = 2
        ctx.setLineDash([4, 3])
        ctx.strokeRect(
          zone.x - zone.w * 0.5,
          zone.y - zone.h * 0.6,
          zone.w,
          zone.h + zone.size * 0.4
        )
        ctx.setLineDash([])
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [selectedZone])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const cx = (e.clientX - rect.left) * scaleX
    const cy = (e.clientY - rect.top) * scaleY

    const W = canvas.width
    const H = canvas.height
    const zones: Record<string, { x: number; y: number; r: number }> = {
      cash:    { x: W * 0.5,  y: H * 0.22, r: 45 },
      crypto:  { x: W * 0.22, y: H * 0.48, r: 35 },
      stocks:  { x: W * 0.72, y: H * 0.48, r: 35 },
      dollars: { x: W * 0.3,  y: H * 0.72, r: 30 },
      cards:   { x: W * 0.72, y: H * 0.72, r: 25 },
    }

    let found: string | null = null
    for (const [key, zone] of Object.entries(zones)) {
      const dist = Math.sqrt((cx - zone.x) ** 2 + (cy - zone.y) ** 2)
      if (dist < zone.r) {
        found = key
        break
      }
    }
    setSelectedZone(found === selectedZone ? null : found)
  }

  const selectedAccount = selectedZone ? ACCOUNTS.find((a) => a.key === selectedZone) : null

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3">
        <h1
          className="text-[18px] font-black uppercase tracking-tight font-mono"
          style={{ color: "#1c1c1a" }}
        >
          Fincraft
        </h1>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center active:scale-95 transition-all"
          style={{ border: "2px solid #1c1c1a" }}
        >
          <MorphIcon icon="close" size={16} color="#1c1c1a" />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 px-3 pb-2 relative">
        <div
          className="w-full h-full relative"
          style={{ border: "2px solid #1c1c1a" }}
        >
          <canvas
            ref={canvasRef}
            width={300}
            height={380}
            className="w-full h-full"
            style={{ imageRendering: "pixelated" }}
            onClick={handleCanvasClick}
          />
        </div>

        {/* Info card for selected zone */}
        {selectedAccount && (
          <div
            className="absolute bottom-5 left-5 right-5 p-3"
            style={{
              background: "#f5f4f1",
              border: "2px solid #1c1c1a",
              boxShadow: "3px 3px 0px #1c1c1a",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[11px] font-black tracking-[0.25em] uppercase font-mono"
                  style={{ color: "rgba(28,28,26,0.4)" }}
                >
                  {selectedAccount.label}
                </p>
                <p className="text-[20px] font-black tracking-tighter font-mono" style={{ color: "#1c1c1a" }}>
                  {selectedAccount.key === "cash"
                    ? `$${(selectedAccount.value / 1000000).toFixed(1)}M`
                    : selectedAccount.key === "cards"
                      ? "2 Active"
                      : `$${selectedAccount.value.toLocaleString()}`}
                </p>
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  background: selectedAccount.color,
                  border: "2px solid #1c1c1a",
                }}
              >
                <span
                  className="text-[12px] font-black font-mono"
                  style={{ color: "#1c1c1a" }}
                >
                  {((selectedAccount.value / totalValue) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
