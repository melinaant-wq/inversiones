"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// ── Types ───────────────────────────────────────────────────────

export type UserMode = "new" | "experienced"

interface UserConfigContextType {
  /** true = experienced user with existing investments, false = new user */
  hasInvestments: boolean
  setHasInvestments: (v: boolean) => void
  /** whether the onboarding profile quiz has been completed this session */
  profileComplete: boolean
  setProfileComplete: (v: boolean) => void
}

// ── Context ─────────────────────────────────────────────────────

const UserConfigContext = createContext<UserConfigContextType>({
  hasInvestments: false,
  setHasInvestments: () => {},
  profileComplete: false,
  setProfileComplete: () => {},
})

// ── Provider ────────────────────────────────────────────────────

/**
 * Wrap the app with this provider.
 * The initial value is read from the NEXT_PUBLIC_USER_HAS_INVESTMENTS env var.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_USER_HAS_INVESTMENTS=true   → experienced user (skip onboarding)
 *   NEXT_PUBLIC_USER_HAS_INVESTMENTS=false  → new user (must complete profile)
 */
export function UserConfigProvider({ children }: { children: ReactNode }) {
  const envValue = process.env.NEXT_PUBLIC_USER_HAS_INVESTMENTS === "true"
  const [hasInvestments, setHasInvestments] = useState(envValue)
  const [profileComplete, setProfileComplete] = useState(envValue)

  return (
    <UserConfigContext.Provider
      value={{ hasInvestments, setHasInvestments, profileComplete, setProfileComplete }}
    >
      {children}
    </UserConfigContext.Provider>
  )
}

// ── Hook ────────────────────────────────────────────────────────

export function useUserConfig() {
  return useContext(UserConfigContext)
}
