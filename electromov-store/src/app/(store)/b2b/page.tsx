import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ChartNoAxesColumn, CircleCheck, FileText, Network, Users } from "lucide-react";
import { SectionTitle, ButtonLink } from "@/components/ui";
import { FaqAccordion } from "@/components/faq-accordion";
import { waLink } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Carga eléctrica para edificios, hoteles, empresas y flotas",
  description:
    "Proyectos de carga para consorcios, hoteles, oficinas y flotas en Argentina: relevamiento técnico, balance dinámico entre cocheras, medición por usuario y facturación A.",
  alternates: { canonical: "/b2b" },
  openGraph: { url: "/b2b", title: "Soluciones de carga para empresas y edificios | ElectroMov" },
};

const SEGMENTS = [
  {
    icon: Building2,
    title: "Edificios y consorcios",
    text: "El caso más común: varios propietarios quieren cargar y la acometida del edificio no da para todos a la vez. Se resuelve con balance dinámico y medición individual, sin obra nueva.",
    points: ["Relevamiento de tablero y acometida", "Balance de carga entre cocheras", "Medición y prorrateo por unidad"],
  },
  {
    icon: Users,
    title: "Hoteles y estacionamientos",
    text: "Un punto de carga es hoy un argumento de venta. Lo instalamos con control de acceso para que lo use solo quien corresponde y con registro de consumo por sesión.",
    points: ["Control de acceso por usuario", "Registro de consumo por sesión", "Señalización y cartelería"],
  },
  {
    icon: Network,
    title: "Empresas y flotas",
    text: "Cuando la flota se electrifica, la carga pasa a ser infraestructura crítica. Dimensionamos la instalación para que todos los vehículos salgan cargados cada mañana.",
    points: ["Dimensionamiento por rotación de flota", "Carga programada en horario de menor tarifa", "Reportes de consumo mensuales"],
  },
];

const FAQS = [
  {
    q: "¿Hacen la instalación o solo venden el equipo?",
    a: "Vendemos el equipamiento y coordinamos la instalación con electricistas matriculados. En proyectos de edificio o flota hacemos el relevamiento técnico previo y entregamos el proyecto para que lo ejecute el instalador del cliente o el nuestro.",
  },
  {
    q: "¿Emiten factura A?",
    a: "Sí, factura A con remito para empresas y consorcios. También trabajamos con órdenes de compra y plazos de pago acordados según el volumen del proyecto.",
  },
  {
    q: "¿Cómo se resuelve quién paga la energía en un edificio?",
    a: "Con medición individual por punto de carga. Cada usuario tiene su registro de consumo y la administración prorratea, o el equipo se conecta directamente al medidor de la unidad cuando la instalación lo permite.",
  },
  {
    q: "¿Cuántos puntos de carga necesita mi edificio?",
    a: "Depende de la cantidad de vehículos eléctricos actuales y proyectados, y de la capacidad de la acometida. La regla práctica es dejar la infraestructura preparada para más puntos de los que se instalan hoy: el costo marginal de agregar después es mucho mayor.",
  },
];

export default function B2BPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="ElectroMov para empresas"
        title="Carga eléctrica para edificios, hoteles y flotas"
        description="Cuando hay más de un vehículo, el problema deja de ser el cargador y pasa a ser la instalación. Hacemos el relevamiento, dimensionamos la solución y entregamos el proyecto completo."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {SEGMENTS.map(({ icon: Icon, title, text, points }) => (
          <div key={title} className="rounded-2xl border border-sand-200 bg-white p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-800">
              <Icon className="h-5 w-5 text-volt-400" aria-hidden />
            </span>
            <h2 className="mt-4 text-[19px] font-semibold tracking-tight text-ink-800">{title}</h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-sand-600">{text}</p>
            <ul className="mt-4 space-y-2">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[14px] leading-snug text-ink-800">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-volt-500" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Cómo trabajamos un proyecto</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Relevamiento", d: "Vemos el tablero, la acometida y las distancias. Si es a distancia, con fotos y datos del medidor alcanza para una primera evaluación." },
            { n: "02", t: "Propuesta técnica", d: "Cantidad de puntos, potencia disponible, esquema de balance y presupuesto de equipamiento e instalación." },
            { n: "03", t: "Provisión", d: "Entregamos el equipamiento con factura A y remito, coordinado con el cronograma de obra." },
            { n: "04", t: "Puesta en marcha", d: "Configuración, pruebas de carga, capacitación a los usuarios y documentación final." },
          ].map((step) => (
            <li key={step.n}>
              <span className="font-mono text-[13px] font-semibold text-volt-600">{step.n}</span>
              <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-ink-800">{step.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-sand-600">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 overflow-hidden rounded-3xl bg-ink-800 p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-balance-title text-3xl font-semibold tracking-[-0.03em] text-white">
              Contanos tu proyecto y te armamos la propuesta
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/65">
              Decinos cuántas cocheras o vehículos tenés, si conocés la potencia contratada y en qué plazo lo necesitás.
              Con eso te devolvemos una primera propuesta técnica y económica.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={waLink(
                  "Hola ElectroMov, quiero una propuesta de carga para un proyecto (edificio / hotel / flota). Les paso los datos.",
                )}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center rounded-full bg-volt-500 px-6 text-[15px] font-semibold text-ink-900 hover:bg-volt-400"
              >
                Pedir propuesta por WhatsApp
              </a>
              <ButtonLink href="/ayuda/contacto" variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                Otros canales de contacto
              </ButtonLink>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              { icon: FileText, text: "Factura A y remito" },
              { icon: ChartNoAxesColumn, text: "Reportes de consumo por usuario" },
              { icon: Network, text: "Balance dinámico entre puntos" },
              { icon: Users, text: "Capacitación a usuarios finales" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-[15px] text-white">
                <Icon className="h-4.5 w-4.5 shrink-0 text-volt-400" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Preguntas de proyectos B2B</h2>
        <FaqAccordion faqs={FAQS} />
      </section>

      <p className="mt-10 text-[14.5px] text-sand-600">
        ¿Buscás para tu casa?{" "}
        <Link href="/productos" className="font-semibold text-volt-700 underline underline-offset-4">
          Mirá el catálogo residencial
        </Link>
        .
      </p>

      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Empresas", url: "/b2b" },
        ])}
      />
    </div>
  );
}
