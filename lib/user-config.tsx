"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// ── Types ───────────────────────────────────────────────────────

export type UserMode = "new" | "experienced"

interface UserConfigContextType {
  /**
   * true  = user has opened an account (completed onboarding/profile quiz)
   * false = sin cuenta abierta (hasn't done onboarding yet)
   */
  hasAccount: boolean
  setHasAccount: (v: boolean) => void

  /**
   * true  = user has made at least one investment
   * false = sin inversiones (has account but hasn't invested yet)
   */
  hasInvestments: boolean
  setHasInvestments: (v: boolean) => void

  /**
   * Investor profile name from the onboarding quiz
   * e.g. "Conservador" | "Moderado" | "Audaz"
   */
  profileName: string
  setProfileName: (v: string) => void

  /** whether the onboarding profile quiz has been completed this session */
  profileComplete: boolean
  setProfileComplete: (v: boolean) => void
}

// ── Context ─────────────────────────────────────────────────────

const UserConfigContext = createContext<UserConfigContextType>({
  hasAccount: false,
  setHasAccount: () => {},
  hasInvestments: false,
  setHasInvestments: () => {},
  profileName: "",
  setProfileName: () => {},
  profileComplete: false,
  setProfileComplete: () => {},
})

// ── Provider ────────────────────────────────────────────────────

/**
 * Wrap the app with this provider.
 * Initial values are read from env vars in .env.local:
 *
 *   NEXT_PUBLIC_USER_HAS_ACCOUNT=false      → sin cuenta abierta (onboarding stepper)
 *   NEXT_PUBLIC_USER_HAS_ACCOUNT=true       → cuenta abierta
 *
 *   NEXT_PUBLIC_USER_HAS_INVESTMENTS=false  → sin inversiones (empty home + CTA)
 *   NEXT_PUBLIC_USER_HAS_INVESTMENTS=true   → con inversiones (portfolio home)
 *
 *   NEXT_PUBLIC_USER_PROFILE=Moderado       → investor profile name
 */
export function UserConfigProvider({ children }: { children: ReactNode }) {
  const envHasInvestments = process.env.NEXT_PUBLIC_USER_HAS_INVESTMENTS === "true"
  // hasAccount is true if HAS_ACCOUNT=true OR if HAS_INVESTMENTS=true (invested → must have account)
  const envHasAccount =
    process.env.NEXT_PUBLIC_USER_HAS_ACCOUNT === "true" || envHasInvestments
  const envProfileName = process.env.NEXT_PUBLIC_USER_PROFILE ?? ""

  const [hasAccount, setHasAccount] = useState(envHasAccount)
  const [hasInvestments, setHasInvestments] = useState(envHasInvestments)
  const [profileName, setProfileName] = useState(envProfileName)
  const [profileComplete, setProfileComplete] = useState(envHasInvestments)

  return (
    <UserConfigContext.Provider
      value={{
        hasAccount,
        setHasAccount,
        hasInvestments,
        setHasInvestments,
        profileName,
        setProfileName,
        profileComplete,
        setProfileComplete,
      }}
    >
      {children}
    </UserConfigContext.Provider>
  )
}

// ── Hook ────────────────────────────────────────────────────────

export function useUserConfig() {
  return useContext(UserConfigContext)
}
