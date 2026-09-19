import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  Calculator,
  CheckCircle2,
  Cable,
  Gauge,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";

import { listProducts, getSettings, listCategories, listVehicles } from "@/lib/repo";
import { SITE, waLink } from "@/lib/site";
import { SITE_FAQS } from "@/data/catalog";
import { formatArs, usdToArs, installmentAmount } from "@/lib/money";
import { ProductCard } from "@/components/product-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { JsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cargá tu auto eléctrico en casa | Wallbox y cables Tipo 2 en Argentina",
  description:
    "Wallbox 7 kW, cables Tipo 2, adaptadores y cargadores portátiles para autos eléctricos. Certificación CE, garantía local de 12 meses, envío a todo el país y 12 cuotas sin interés.",
  alternates: { canonical: "/" },
};

const CATEGORY_ICONS = {
  wallbox: PlugZap,
  cable: Cable,
  adapter: BatteryCharging,
  portable: Gauge,
  moto: Sparkles,
  all: PlugZap,
} as const;

export default async function HomePage() {
  const [products, settings, categories, vehicles] = await Promise.all([
    listProducts(),
    getSettings(),
    listCategories(),
    listVehicles(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 3);
  const hero = products.find((p) => p.slug === "wallbox-7kw-smart") ?? products[0];
  const heroPriceArs = hero ? usdToArs(hero.priceUsd, settings.usdRate) : 0;

  // Ahorro de referencia: 1.000 km/mes en un EV medio vs un nafta de 8 L/100 km.
  const kmMes = 1000;
  const evConsumo = 15.5; // kWh/100 km
  const naftaConsumo = 8; // L/100 km
  const costoEv = (kmMes / 100) * evConsumo * settings.kwhPriceArs;
  const costoNafta = (kmMes / 100) * naftaConsumo * settings.fuelPriceArs;
  const ahorroMensual = costoNafta - costoEv;
  const ahorroPct = Math.round((1 - costoEv / costoNafta) * 100);

  const brands = Array.from(new Set(vehicles.map((v) => v.brand)));

  return (
    <>
      {/* ---------------------------------- HERO --------------------------------- */}
      <section className="relative overflow-hidden bg-ink-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 75% 10%, rgba(0,199,118,0.45) 0%, transparent 60%), radial-gradient(40% 40% at 10% 90%, rgba(33,221,147,0.28) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="container-page relative grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="animate-[fade-up_0.6s_ease-out_both]">
            <p className="inline-flex items-center gap-2 rounded-full border border-volt-500/30 bg-volt-500/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-volt-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-[pulse-soft_2.6s_ease-in-out_infinite] rounded-full bg-volt-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-volt-400" />
              </span>
              Especialistas 100% en movilidad eléctrica · Argentina
            </p>

            <h1 className="text-balance-title mt-6 text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-[54px] lg:text-[60px]">
              Cargá tu auto en casa.{" "}
              <span className="bg-gradient-to-r from-volt-300 to-volt-500 bg-clip-text text-transparent">
                Gastá 90% menos
              </span>{" "}
              que con nafta.
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/70 sm:text-[18px]">
              Wallbox, cables Tipo 2, adaptadores y cargadores portátiles con certificación CE, garantía de 12 meses y
              soporte técnico real acá, en Argentina. Enchufás de noche, salís al 100% todas las mañanas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/productos" size="lg">
                Ver productos <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <Link
                href="/asesor"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-base font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
              >
                ¿Cuál me conviene?
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">
              {[
                { k: "90%", v: "menos de costo por km" },
                { k: "12", v: "cuotas sin interés" },
                { k: "24 h", v: "de despacho tras el pago" },
              ].map((stat) => (
                <div key={stat.k}>
                  <dt className="text-2xl font-semibold tracking-tight text-volt-300 sm:text-3xl">{stat.k}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-white/55">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {hero ? (
            <div className="relative animate-[fade-up_0.8s_ease-out_both]">
              <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
                <div className="relative aspect-square">
                  <Image
                    src={hero.images[0]?.url ?? ""}
                    alt={hero.images[0]?.alt ?? hero.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 460px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-[13px] font-semibold uppercase tracking-wider text-volt-400">Más vendido</p>
                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white">{hero.name}</h2>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/60">{hero.tagline}</p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-2xl font-semibold tracking-tight text-white">{formatArs(heroPriceArs)}</p>
                      <p className="text-[13px] text-volt-300">
                        {settings.maxInstallments} × {formatArs(installmentAmount(heroPriceArs, settings.maxInstallments))} sin interés
                      </p>
                    </div>
                    <ButtonLink href={`/productos/${hero.slug}`} size="sm">
                      Ver
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Marcas compatibles */}
        <div className="relative border-t border-white/10 py-5">
          <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-white/40">
              Compatible con
            </span>
            {brands.map((brand) => (
              <span key={brand} className="text-[15px] font-medium text-white/55">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- BENEFICIOS ------------------------------- */}
      <section id="envios" className="border-b border-sand-200 bg-white">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "Garantía 12 meses", d: "Certificación CE e IEC 62196" },
            { icon: Truck, t: "Envío a todo el país", d: "Gratis desde $80.000" },
            { icon: Wallet, t: "12 cuotas sin interés", d: "Con Mercado Pago" },
            { icon: PlugZap, t: "Asesoramiento técnico", d: "Antes y después de comprar" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-volt-50">
                <Icon className="h-5 w-5 text-volt-600" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-ink-800">{t}</span>
                <span className="block text-[13px] text-sand-500">{d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------- CATEGORÍAS ------------------------------- */}
      <section id="productos" className="container-page py-16 sm:py-20">
        <SectionTitle
          eyebrow="Catálogo"
          title="Todo lo que necesitás para cargar"
          description="Cinco familias de producto que cubren el 100% de los casos de carga en Argentina: desde la solución definitiva en casa hasta el respaldo que vive en el baúl."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const count = products.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col rounded-2xl border border-sand-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-800 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-800 transition-colors group-hover:bg-volt-500">
                  <Icon className="h-5 w-5 text-volt-400 transition-colors group-hover:text-ink-900" aria-hidden />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-ink-800">{cat.shortName}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-sand-600">{cat.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-volt-700">
                  Ver {count} {count === 1 ? "producto" : "productos"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* -------------------------------- DESTACADOS ------------------------------- */}
      <section id="wallbox" className="bg-sand-50 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Lo más elegido" title="Los que más se venden" />
            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink-800 hover:text-volt-700"
            >
              Ver todo el catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} settings={settings} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- HERRAMIENTAS ----------------------------- */}
      <section id="asesor" className="container-page py-16 sm:py-20">
        <SectionTitle
          eyebrow="Antes de comprar"
          title="Dos herramientas para decidir sin equivocarte"
          description="No vendemos por catálogo: te ayudamos a elegir el equipo correcto para tu auto, tu instalación y tus kilómetros."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Link
            href="/asesor"
            className="group relative overflow-hidden rounded-3xl bg-ink-800 p-8 transition-transform duration-300 hover:-translate-y-0.5 sm:p-10"
          >
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-volt-500/20 blur-2xl transition-all group-hover:bg-volt-500/30"
            />
            <PlugZap className="h-8 w-8 text-volt-400" aria-hidden />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">Asesor de carga</h3>
            <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-white/65">
              Cuatro preguntas sobre tu auto, tu instalación eléctrica y cuánto manejás por día. Te decimos exactamente
              qué equipo comprar y por qué, sin venderte de más.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-volt-300">
              Empezar el asesor <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            id="ahorro"
            href="/calculadora"
            className="group relative overflow-hidden rounded-3xl border border-sand-200 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-800 sm:p-10"
          >
            <Calculator className="h-8 w-8 text-volt-600" aria-hidden />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink-800">Calculadora de ahorro</h3>
            <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-sand-600">
              Con {kmMes.toLocaleString("es-AR")} km por mes, cargar en casa cuesta{" "}
              <strong className="text-ink-800">{formatArs(costoEv)}</strong> contra{" "}
              <strong className="text-ink-800">{formatArs(costoNafta)}</strong> de nafta. Son{" "}
              <strong className="text-volt-700">{formatArs(ahorroMensual)} por mes</strong> que dejás de gastar
              ({ahorroPct}% menos).
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-volt-700">
              Calcular con mis números <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* ------------------------------ CÓMO FUNCIONA ------------------------------ */}
      <section className="border-y border-sand-200 bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionTitle
            eyebrow="Cómo es el proceso"
            title="De la consulta a cargar en casa, en una semana"
            align="center"
          />
          <ol className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Elegís", d: "Usás el asesor o nos escribís por WhatsApp. Te confirmamos el equipo correcto para tu auto y tu tablero." },
              { n: "02", t: "Comprás", d: "Pagás con Mercado Pago en hasta 12 cuotas sin interés, por transferencia o en efectivo en el local." },
              { n: "03", t: "Recibís", d: "Despachamos dentro de las 24 h hábiles por Andreani o Correo Argentino, con seguimiento." },
              { n: "04", t: "Instalás", d: "Te pasamos el esquema para tu electricista matriculado. Si te trabás, te acompañamos por videollamada." },
            ].map((step) => (
              <li key={step.n}>
                <span className="font-mono text-[13px] font-semibold text-volt-600">{step.n}</span>
                <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-ink-800">{step.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-sand-600">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------- B2B ---------------------------------- */}
      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <Building2 className="h-8 w-8 text-volt-600" aria-hidden />
              <h2 className="text-balance-title mt-4 text-3xl font-semibold tracking-[-0.03em] text-ink-800">
                ¿Edificio, hotel, flota u oficina?
              </h2>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-sand-600">
                Proyectamos la instalación completa: cantidad de puntos, balance de carga entre cocheras, medición por
                usuario y facturación. Trabajamos con administradores, desarrolladores y empresas con flota.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/b2b" variant="dark">
                  Ver soluciones para empresas
                </ButtonLink>
                <a
                  href={waLink("Hola ElectroMov, quiero cotizar carga para un edificio o flota.")}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-sand-300 px-5 text-[15px] font-semibold text-ink-800 hover:border-ink-800"
                >
                  Pedir cotización
                </a>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Relevamiento técnico del tablero y la acometida",
                "Balance dinámico entre varios puntos de carga",
                "Medición y facturación por usuario",
                "Factura A y remito · entrega coordinada",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-volt-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------------------------- FAQ ---------------------------------- */}
      <section id="faq" className="container-page pb-16 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle
            eyebrow="Preguntas frecuentes"
            title="Las dudas que nos llegan todos los días"
            description="Si la tuya no está, escribinos por WhatsApp: contestamos nosotros, no un bot."
          />
          <div>
            <FaqAccordion faqs={SITE_FAQS} />
            <a
              href={waLink("Hola ElectroMov, tengo una consulta que no está en las preguntas frecuentes.")}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-[15px] font-semibold text-[#052e16]"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <JsonLd data={faqJsonLd(SITE_FAQS)} />
      <JsonLd data={itemListJsonLd(featured, settings, "Productos destacados de ElectroMov")} />
    </>
  );
}
