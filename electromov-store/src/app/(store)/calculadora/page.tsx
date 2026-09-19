import type { Metadata } from "next";
import { getSettings, listVehicles, getProduct } from "@/lib/repo";
import { SavingsCalculator } from "@/components/savings-calculator";
import { SectionTitle } from "@/components/ui";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Calculadora: cuánto ahorrás con un auto eléctrico en Argentina",
  description:
    "Calculá cuánto cuesta cargar tu auto eléctrico en casa frente a cargar nafta, con la tarifa eléctrica y el precio de combustible actuales. Incluye el repago del Wallbox.",
  alternates: { canonical: "/calculadora" },
  openGraph: { url: "/calculadora", title: "Calculadora de ahorro eléctrico vs nafta | ElectroMov" },
};

const FAQS = [
  {
    q: "¿Cuánto cuesta cargar un auto eléctrico en casa en Argentina?",
    a: "Con una tarifa de aproximadamente $132 por kWh, cargar un auto de 40 kWh del 0 al 100% cuesta cerca de $5.500 y te da entre 250 y 300 km. El mismo recorrido con un auto naftero de 8 L/100 km cuesta alrededor de $25.000.",
  },
  {
    q: "¿El cálculo incluye las pérdidas de carga?",
    a: "Sí. La calculadora suma un 10% sobre la energía que entra a la batería, que es la pérdida típica de una carga en corriente alterna. Es la energía que realmente te factura la distribuidora.",
  },
  {
    q: "¿Conviene cargar de noche?",
    a: "Sí, siempre que tengas tarifa con discriminación horaria. Además, cargar de noche baja la exigencia sobre la instalación de tu casa porque el resto de los consumos están apagados.",
  },
];

export default async function CalculadoraPage() {
  const [settings, wallbox] = await Promise.all([getSettings(), getProduct("wallbox-7kw-smart")]);
  const vehicles = listVehicles();

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Calculadora de ahorro"
        title="Cuánto dejás de gastar con un auto eléctrico"
        description="Poné tus kilómetros, tu tarifa y el precio de la nafta. Te mostramos el ahorro mensual, el costo por kilómetro y en cuánto tiempo se paga solo el Wallbox."
      />

      <div className="mt-10">
        <SavingsCalculator settings={settings} vehicles={vehicles} wallboxPriceUsd={wallbox?.priceUsd ?? 540} />
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Por qué la diferencia es tan grande</h2>
        <div className="prose-em mt-4 text-[16px] text-sand-700">
          <p>
            Un motor eléctrico convierte en movimiento más del 85% de la energía que recibe. Un motor de combustión
            interna ronda el 30%: el resto se va en calor. Esa diferencia física es la que explica el salto de costo,
            más allá del precio relativo de la energía.
          </p>
          <p>
            A eso se suma el precio local. Cargar en casa con tarifa residencial es la forma más barata de energía para
            transporte que existe hoy en Argentina, incluso después de las actualizaciones de tarifa. Cargar en un punto
            público rápido cuesta más, pero sigue siendo competitivo contra la nafta.
          </p>
          <h3>Lo que la calculadora no incluye</h3>
          <ul>
            <li>El mantenimiento, que en un eléctrico es sensiblemente menor: no hay aceite, filtros ni embrague.</li>
            <li>El desgaste de frenos, que baja mucho por la frenada regenerativa.</li>
            <li>La patente y los beneficios impositivos, que varían por municipio y provincia.</li>
          </ul>
          <p>
            Si querés el número exacto para tu caso, escribinos con tu modelo y tu consumo real y lo armamos juntos.
          </p>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Calculadora de ahorro", url: "/calculadora" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}
