"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  User,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Moon,
  Fingerprint,
  Globe,
} from "lucide-react"

interface SettingsBottomSheetProps {
  open: boolean
  onClose: () => void
}

interface SettingsRow {
  icon: React.ReactNode
  label: string
  subtitle?: string
  danger?: boolean
  toggle?: boolean
}

const ACCOUNT_ROWS: SettingsRow[] = [
  { icon: <User className="w-[18px] h-[18px]" />, label: "Datos personales", subtitle: "Nombre, DNI, email" },
  { icon: <Shield className="w-[18px] h-[18px]" />, label: "Seguridad", subtitle: "Contrasena, 2FA" },
  { icon: <CreditCard className="w-[18px] h-[18px]" />, label: "Metodos de pago" },
]

const PREFERENCES_ROWS: SettingsRow[] = [
  { icon: <Bell className="w-[18px] h-[18px]" />, label: "Notificaciones", toggle: true },
  { icon: <Moon className="w-[18px] h-[18px]" />, label: "Modo oscuro", toggle: true },
  { icon: <Fingerprint className="w-[18px] h-[18px]" />, label: "Biometria", toggle: true },
  { icon: <Globe className="w-[18px] h-[18px]" />, label: "Idioma", subtitle: "Espanol" },
]

const SUPPORT_ROWS: SettingsRow[] = [
  { icon: <HelpCircle className="w-[18px] h-[18px]" />, label: "Centro de ayuda" },
  { icon: <FileText className="w-[18px] h-[18px]" />, label: "Terminos y privacidad" },
]

export default function SettingsBottomSheet({ open, onClose }: SettingsBottomSheetProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Notificaciones: true,
    "Modo oscuro": false,
    Biometria: true,
  })

  const handleToggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const renderRow = (row: SettingsRow, index: number, isLast: boolean) => (
    <div key={index}>
      <button
        className="flex items-center gap-3.5 w-full py-3 px-1 text-left active:opacity-70 transition-opacity"
        onClick={row.toggle ? () => handleToggle(row.label) : undefined}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: row.danger ? "rgba(230,57,70,0.1)" : "rgba(28,28,26,0.06)",
            color: row.danger ? "#E63946" : "rgba(28,28,26,0.55)",
          }}
        >
          {row.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[14px] font-medium"
            style={{ color: row.danger ? "#E63946" : "#1c1c1a" }}
          >
            {row.label}
          </p>
          {row.subtitle && (
            <p className="text-[12px] mt-0.5" style={{ color: "rgba(28,28,26,0.4)" }}>
              {row.subtitle}
            </p>
          )}
        </div>
        {row.toggle ? (
          <div
            className="w-11 h-[26px] rounded-full p-[3px] flex-shrink-0 transition-colors duration-200"
            style={{ background: toggles[row.label] ? "#ddf74c" : "rgba(28,28,26,0.12)" }}
          >
            <motion.div
              className="w-5 h-5 rounded-full"
              style={{ background: toggles[row.label] ? "#1c1c1a" : "#f5f4f1" }}
              animate={{ x: toggles[row.label] ? 18 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          </div>
        ) : !row.danger ? (
          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(28,28,26,0.2)" }} />
        ) : null}
      </button>
      {!isLast && (
        <div className="ml-12" style={{ height: 1, background: "rgba(28,28,26,0.06)" }} />
      )}
    </div>
  )

  const renderSection = (title: string, rows: SettingsRow[]) => (
    <div className="mb-5">
      <p className="text-[12px] font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(28,28,26,0.35)" }}>
        {title}
      </p>
      {rows.map((row, i) => renderRow(row, i, i === rows.length - 1))}
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          className="absolute inset-x-0 bottom-0 z-60 flex flex-col overflow-hidden"
          style={{
            height: "88%",
            background: "#f5f4f1",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: "0 -4px 30px rgba(0,0,0,0.12)",
          }}
        >
          {/* Handle + header */}
          <div className="flex flex-col items-center pt-3 pb-2 px-5">
            <div className="w-10 h-1 rounded-full mb-4" style={{ background: "rgba(28,28,26,0.15)" }} />
            <div className="flex items-center justify-between w-full">
              <h2 className="text-[18px] font-bold" style={{ color: "#1c1c1a" }}>
                Ana Varela
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <X className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              </button>
            </div>
          </div>

          {/* Scrollable settings */}
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            {renderSection("Cuenta", ACCOUNT_ROWS)}
            {renderSection("Preferencias", PREFERENCES_ROWS)}
            {renderSection("Soporte", SUPPORT_ROWS)}

            {/* Sign out */}
            {renderRow(
              { icon: <LogOut className="w-[18px] h-[18px]" />, label: "Cerrar sesion", danger: true },
              0,
              true
            )}

            {/* Version */}
            <p className="text-[11px] text-center mt-6" style={{ color: "rgba(28,28,26,0.2)" }}>
              Lemon v4.2.0
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
