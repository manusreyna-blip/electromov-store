import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSettings, listVehicles } from "@/lib/repo";
import { ChargeSimulator } from "@/components/charge-simulator";
import { SectionTitle } from "@/components/ui";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Compatibilidad: qué cargador va con cada auto eléctrico",
  description:
    "Tabla de compatibilidad de carga para BYD, Renault, Chevrolet, Volvo, Peugeot, BMW, Mercedes y Toyota en Argentina: conector, potencia AC máxima y equipo recomendado.",
  alternates: { canonical: "/compatibilidad" },
  openGraph: { url: "/compatibilidad", title: "Compatibilidad de carga por vehículo | ElectroMov" },
};

export default async function CompatibilidadPage() {
  const settings = await getSettings();
  const vehicles = listVehicles();

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Compatibilidad"
        title="Qué cargador corresponde a cada auto eléctrico"
        description="Todos los eléctricos e híbridos enchufables que se venden en Argentina usan conector Tipo 2 (IEC 62196). Lo que cambia entre modelos es la potencia máxima que aceptan en corriente alterna, y eso define qué equipo te conviene."
      />

      <div className="mt-10 overflow-hidden rounded-2xl border border-sand-200">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-sand-50 text-[13px] uppercase tracking-wide text-sand-500">
              <th scope="col" className="px-4 py-3.5 font-semibold sm:px-5">
                Vehículo
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold sm:px-5">
                Batería
              </th>
              <th scope="col" className="hidden px-4 py-3.5 font-semibold sm:table-cell sm:px-5">
                Conector
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold sm:px-5">
                Máx. AC
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold sm:px-5">
                <span className="sr-only">Ver detalle</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200 text-[14.5px]">
            {vehicles.map((v) => (
              <tr key={v.slug} className="bg-white transition-colors hover:bg-sand-50">
                <th scope="row" className="px-4 py-4 font-medium text-ink-800 sm:px-5">
                  <Link href={`/compatibilidad/${v.slug}`} className="hover:underline">
                    {v.brand} {v.model}
                  </Link>
                  <span className="ml-2 rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-sand-600">
                    {v.type}
                  </span>
                </th>
                <td className="px-4 py-4 text-sand-600 sm:px-5">{v.batteryKwh} kWh</td>
                <td className="hidden px-4 py-4 text-sand-600 sm:table-cell sm:px-5">{v.connector}</td>
                <td className="px-4 py-4 font-medium text-ink-800 sm:px-5">{v.maxAcKw} kW</td>
                <td className="px-4 py-4 text-right sm:px-5">
                  <Link
                    href={`/compatibilidad/${v.slug}`}
                    className="inline-flex items-center gap-1 text-[14px] font-semibold text-volt-700"
                    aria-label={`Ver carga del ${v.brand} ${v.model}`}
                  >
                    Ver <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13.5px] text-sand-500">
        ¿No está tu modelo? Escribinos por WhatsApp y lo agregamos: trabajamos con todos los vehículos con conector
        Tipo 2.
      </p>

      <section className="mt-14">
        <ChargeSimulator vehicles={vehicles} kwhPriceArs={settings.kwhPriceArs} />
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Compatibilidad", url: "/compatibilidad" },
        ])}
      />
    </div>
  );
}
