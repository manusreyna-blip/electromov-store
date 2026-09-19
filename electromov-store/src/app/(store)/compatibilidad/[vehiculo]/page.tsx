import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { VEHICLES } from "@/data/catalog";
import { getSettings, listProducts, listVehicles } from "@/lib/repo";
import { ProductCard } from "@/components/product-card";
import { ChargeSimulator } from "@/components/charge-simulator";
import { FaqAccordion } from "@/components/faq-accordion";
import { formatArs } from "@/lib/money";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const revalidate = 300;

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ vehiculo: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ vehiculo: string }> }): Promise<Metadata> {
  const { vehiculo } = await params;
  const v = VEHICLES.find((x) => x.slug === vehiculo);
  if (!v) return { title: "Vehículo no encontrado" };
  const title = `Cargador para ${v.brand} ${v.model} — Wallbox y cables Tipo 2`;
  const description = `Qué cargador necesita el ${v.brand} ${v.model} en Argentina: conector ${v.connector}, hasta ${v.maxAcKw} kW en AC y batería de ${v.batteryKwh} kWh. Tiempos de carga reales, costo por carga y equipo recomendado.`;
  return {
    title,
    description,
    alternates: { canonical: `/compatibilidad/${v.slug}` },
    openGraph: { url: `/compatibilidad/${v.slug}`, title, description },
  };
}

export default async function VehiclePage({ params }: { params: Promise<{ vehiculo: string }> }) {
  const { vehiculo } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === vehiculo);
  if (!vehicle) notFound();

  const [products, settings] = await Promise.all([listProducts(), getSettings()]);
  const recommended = products.find((p) => p.slug === vehicle.recommended);
  const alsoWorks = products.filter((p) => vehicle.alsoWorks.includes(p.slug));

  const horasWallbox = (vehicle.batteryKwh * 0.8) / (Math.min(7.4, vehicle.maxAcKw) * 0.9);
  const horasPortatil = (vehicle.batteryKwh * 0.8) / (3.5 * 0.9);
  const costoCargaCompleta = vehicle.batteryKwh * settings.kwhPriceArs * 1.1;
  const autonomia = Math.round((vehicle.batteryKwh / vehicle.consumptionKwh100) * 100);

  const faqs = [
    {
      q: `¿Qué conector usa el ${vehicle.brand} ${vehicle.model}?`,
      a: `Usa conector ${vehicle.connector}, según la norma IEC 62196-2. Es el estándar de todos los vehículos eléctricos e híbridos enchufables que se venden en Argentina, así que cualquier wallbox o cable Tipo 2 es compatible.`,
    },
    {
      q: `¿Cuánto tarda en cargar el ${vehicle.brand} ${vehicle.model} en casa?`,
      a: `Del 20% al 100%, con un Wallbox de 7 kW tarda alrededor de ${Math.round(horasWallbox)} horas, y con un cargador portátil de 3,5 kW enchufado a 220 V tarda cerca de ${Math.round(horasPortatil)} horas. En ambos casos entra cómodo en una carga nocturna.`,
    },
    {
      q: `¿Cuánto cuesta cargarlo?`,
      a: `Una carga completa de sus ${vehicle.batteryKwh} kWh cuesta aproximadamente ${formatArs(costoCargaCompleta)} con la tarifa vigente, incluyendo las pérdidas de carga. Eso te da unos ${autonomia} km de autonomía.`,
    },
    {
      q: `¿Le sirve un cargador de más potencia?`,
      a: `El ${vehicle.model} acepta hasta ${vehicle.maxAcKw} kW en corriente alterna. Un equipo de mayor potencia funciona igual, pero el auto va a tomar solo ${vehicle.maxAcKw} kW: no ganás tiempo pagando de más.`,
    },
  ];

  return (
    <div className="container-page py-10 sm:py-14">
      <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-sand-500">
        <Link href="/" className="hover:text-ink-800">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/compatibilidad" className="hover:text-ink-800">
          Compatibilidad
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-ink-800">
          {vehicle.brand} {vehicle.model}
        </span>
      </nav>

      <header className="max-w-3xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-volt-700">Guía de carga</p>
        <h1 className="text-balance-title mt-2 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink-800 sm:text-[42px]">
          Cargador para {vehicle.brand} {vehicle.model}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-sand-600">
          El {vehicle.brand} {vehicle.model} monta una batería de {vehicle.batteryKwh} kWh y acepta hasta{" "}
          {vehicle.maxAcKw} kW de carga en corriente alterna a través de un conector {vehicle.connector}. Con eso
          definido, elegir el equipo correcto es simple.
        </p>
      </header>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { t: "Batería", v: `${vehicle.batteryKwh} kWh` },
          { t: "Autonomía estimada", v: `${autonomia} km` },
          { t: "Carga máx. en AC", v: `${vehicle.maxAcKw} kW` },
          { t: "Costo carga completa", v: formatArs(costoCargaCompleta) },
        ].map((item) => (
          <div key={item.t} className="rounded-2xl border border-sand-200 bg-white p-5">
            <dt className="text-[12.5px] font-semibold uppercase tracking-wide text-sand-500">{item.t}</dt>
            <dd className="mt-1.5 text-2xl font-semibold tracking-tight text-ink-800">{item.v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Tiempos de carga reales</h2>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-sand-600">
          Calculado del 20% al 100% de batería, que es el ciclo típico de una carga nocturna, con un 10% de pérdidas.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-sand-200">
          <table className="w-full border-collapse text-left text-[15px]">
            <thead>
              <tr className="bg-sand-50 text-[13px] uppercase tracking-wide text-sand-500">
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Equipo
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Potencia real
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Tiempo 20 → 100%
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200 bg-white">
              <tr>
                <th scope="row" className="px-5 py-4 font-medium text-ink-800">
                  Wallbox 7 kW Smart
                </th>
                <td className="px-5 py-4 text-sand-600">{Math.min(7.4, vehicle.maxAcKw)} kW</td>
                <td className="px-5 py-4 font-medium text-volt-700">≈ {Math.round(horasWallbox)} h</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-medium text-ink-800">
                  EVSE portátil 3,5 kW (220 V)
                </th>
                <td className="px-5 py-4 text-sand-600">3,5 kW</td>
                <td className="px-5 py-4 font-medium text-sand-700">≈ {Math.round(horasPortatil)} h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {recommended ? (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">
            Lo que recomendamos para este auto
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard product={recommended} settings={settings} priority />
            {alsoWorks.map((p) => (
              <ProductCard key={p.id} product={p} settings={settings} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <ChargeSimulator vehicles={listVehicles()} kwhPriceArs={settings.kwhPriceArs} />
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">
          Preguntas sobre cargar el {vehicle.model}
        </h2>
        <FaqAccordion faqs={faqs} />
      </section>

      <section className="mt-14 border-t border-sand-200 pt-8">
        <h2 className="text-[15px] font-semibold uppercase tracking-wide text-sand-500">Otros vehículos</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {VEHICLES.filter((v) => v.slug !== vehicle.slug).map((v) => (
            <Link
              key={v.slug}
              href={`/compatibilidad/${v.slug}`}
              className="rounded-full border border-sand-200 px-4 py-2 text-[14px] font-medium text-ink-800 transition-colors hover:border-ink-800"
            >
              {v.brand} {v.model}
            </Link>
          ))}
        </div>
      </section>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Compatibilidad", url: "/compatibilidad" },
          { name: `${vehicle.brand} ${vehicle.model}`, url: `/compatibilidad/${vehicle.slug}` },
        ])}
      />
    </div>
  );
}
