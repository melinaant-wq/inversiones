"use client"

import { ArrowLeft } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    id: "faq-1",
    question: "Como funcionan los rendimientos?",
    answer:
      "Tus dolares se invierten automaticamente en protocolos de finanzas descentralizadas (DeFi) auditados y seguros. Los intereses se acreditan diariamente a tu cuenta, y podes retirar tu dinero en cualquier momento.",
  },
  {
    id: "faq-2",
    question: "Puedo perder mi dinero?",
    answer:
      "Los protocolos que utilizamos son auditados por firmas de seguridad lideres y tienen historiales probados. Sin embargo, como toda inversion, existe un riesgo inherente. Por eso te ofrecemos diferentes perfiles de riesgo para que elijas el que mejor se adapte a vos.",
  },
  {
    id: "faq-3",
    question: "Cuando se acreditan las ganancias?",
    answer:
      "Las ganancias se acreditan diariamente de forma automatica. Podes ver el detalle en la seccion de Ganancia Acumulada. No necesitas hacer nada, tu dinero crece solo.",
  },
  {
    id: "faq-4",
    question: "Que es un protocolo de inversion?",
    answer:
      "Un protocolo de inversion es un sistema automatizado que gestiona tus fondos siguiendo reglas predefinidas. Cada protocolo tiene diferentes estrategias, niveles de riesgo y retornos esperados. Nosotros seleccionamos solo los mas seguros y probados del mercado.",
  },
  {
    id: "faq-5",
    question: "Que pasa si quiero retirar mis dolares?",
    answer:
      "Podes retirar tus dolares en cualquier momento, sin penalidades ni periodos de espera. El retiro se procesa de forma inmediata y los rendimientos generados hasta ese momento quedan acreditados en tu cuenta.",
  },
  {
    id: "faq-6",
    question: "Que es USDC y por que se usa?",
    answer:
      "USDC es una stablecoin respaldada 1:1 por el dolar estadounidense, emitida por Circle. Es una de las mas reguladas y transparentes del mercado, con reservas auditadas mensualmente. Se utiliza como vehiculo para generar rendimientos en protocolos DeFi.",
  },
]

export default function UsdRendimientosFaqScreen({ onBack }: { onBack: () => void }) {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background no-scrollbar">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Preguntas frecuentes</h1>
        </div>
      </header>

      <section className="mt-4 px-5 pb-10">
        <div className="rounded-2xl bg-card p-2 shadow-sm">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-border/50 px-3"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  )
}
