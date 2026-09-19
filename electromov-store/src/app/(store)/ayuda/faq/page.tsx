import type { Metadata } from "next";
import Link from "next/link";
import { SITE_FAQS } from "@/data/catalog";
import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { waLink } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre carga de autos eléctricos",
  description:
    "Qué cargador necesita tu auto, si podés cargar desde un enchufe común, cuánto cuesta cargar en casa, garantías, envíos y formas de pago. Respuestas claras, sin vueltas.",
  alternates: { canonical: "/ayuda/faq" },
  openGraph: { url: "/ayuda/faq", title: "Preguntas frecuentes | ElectroMov" },
};

const EXTRA_FAQS = [
  {
    q: "¿Los cargadores funcionan con cortes de luz o tensión baja?",
    a: "Todos nuestros equipos cortan la carga de forma segura si la tensión sale del rango de trabajo y la reanudan solos cuando vuelve a la normalidad. En zonas con tensión inestable conviene bajar el amperaje de carga: se carga un poco más lento, pero se reduce mucho la exigencia sobre la instalación.",
  },
  {
    q: "¿Puedo cargar en un cargador público con estos productos?",
    a: "Sí, con el cable Tipo 2 Mode 3. La mayoría de los puntos públicos en Argentina son solo toma, sin cable propio, así que el cable es lo que te permite usarlos.",
  },
  {
    q: "¿Qué pasa si el producto llega fallado?",
    a: "Lo cambiamos. Tenés 12 meses de garantía contra falla de fábrica y, en los primeros 10 días corridos, además podés arrepentirte de la compra sin necesidad de justificar nada, según la Ley 24.240.",
  },
  {
    q: "¿Emiten factura?",
    a: "Sí, en todas las compras. Para empresas y consorcios emitimos factura A con remito. Cargá tu CUIT en el checkout o pasanoslo por WhatsApp junto con el número de pedido.",
  },
  {
    q: "¿Tienen local para ver los productos?",
    a: "Sí, estamos en Berazategui, GBA Sur, de lunes a sábado de 9 a 18 h. Escribinos antes por WhatsApp para coordinar y asegurarte de que esté el producto que querés ver.",
  },
];

export default function FaqPage() {
  const all = [...SITE_FAQS, ...EXTRA_FAQS];

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-3xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-volt-700">Ayuda</p>
        <h1 className="text-balance-title mt-2 text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-800 sm:text-[40px]">
          Preguntas frecuentes
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-sand-600">
          Todo lo que nos preguntan antes de comprar, respondido con el mismo criterio con el que atendemos por
          WhatsApp: sin vueltas y sin prometer lo que el producto no hace.
        </p>
      </header>

      <div className="mt-10 max-w-3xl">
        <FaqAccordion faqs={all} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={waLink("Hola ElectroMov, tengo una consulta que no está en las preguntas frecuentes.")}
          target="_blank"
          rel="noopener"
          className="inline-flex h-12 items-center rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-[#052e16]"
        >
          Preguntar por WhatsApp
        </a>
        <Link
          href="/asesor"
          className="inline-flex h-12 items-center rounded-full border border-ink-800 px-6 text-[15px] font-semibold text-ink-800 hover:bg-ink-800 hover:text-white"
        >
          Usar el asesor de carga
        </Link>
      </div>

      <JsonLd data={faqJsonLd(all)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Ayuda", url: "/ayuda/faq" },
          { name: "Preguntas frecuentes", url: "/ayuda/faq" },
        ])}
      />
    </div>
  );
}
