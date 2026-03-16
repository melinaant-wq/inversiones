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
      "Tus pesos se convierten automaticamente en sARS, una moneda sintetica que permite invertir en protocolos DeFi auditados y seguros. Los intereses se acreditan diariamente a tu cuenta, y podes retirar tu dinero en cualquier momento.",
  },
  {
    id: "faq-2",
    question: "Puedo perder mi dinero?",
    answer:
      "Los protocolos que utilizamos son auditados por firmas de seguridad lideres y tienen historiales probados. Sin embargo, como toda inversion, existe un riesgo inherente. Tu dinero esta respaldado 1:1 y podes retirarlo cuando quieras.",
  },
  {
    id: "faq-3",
    question: "Cuando se acreditan las ganancias?",
    answer:
      "Las ganancias se acreditan diariamente de forma automatica. Podes ver el detalle en la seccion de Rendimientos. No necesitas hacer nada, tu plata crece sola.",
  },
  {
    id: "faq-4",
    question: "Que es sARS?",
    answer:
      "sARS (sur ARS) es una moneda sintetica que replica el valor del peso argentino. Permite que tus pesos se inviertan en protocolos optimizados generando rendimientos superiores al mercado. Al retirar, se convierten de vuelta a pesos al instante.",
  },
  {
    id: "faq-5",
    question: "Que pasa si quiero retirar mis pesos?",
    answer:
      "Podes retirar tus pesos en cualquier momento, sin penalidades ni periodos de espera. El retiro se procesa de forma inmediata y los rendimientos generados hasta ese momento quedan acreditados en tu cuenta.",
  },
  {
    id: "faq-6",
    question: "Por que la tasa es mas alta que en un banco?",
    answer:
      "Utilizamos protocolos de finanzas descentralizadas (DeFi) que operan con menores costos operativos que las instituciones tradicionales. Esto nos permite trasladarte un mayor rendimiento, alcanzando un 29,5% TNA frente al 18% promedio de bancos.",
  },
]

export default function RendimientosFaqScreen({ onBack }: { onBack: () => void }) {
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
