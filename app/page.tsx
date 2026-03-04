import OnboardingFlow from "@/components/onboarding-flow"
import PasswordGate from "@/components/password-gate"

export default function Home() {
  return (
    <PasswordGate>
      <main className="min-h-screen flex items-center justify-center p-4" style={{ background: "#e5e4e1" }}>
        <OnboardingFlow />
      </main>
    </PasswordGate>
  )
}
