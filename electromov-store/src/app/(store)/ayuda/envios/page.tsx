import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { SHIPPING_ZONES, SHIPPING_RATES } from "@/lib/site";
import { formatArs } from "@/lib/money";
import { getSettings } from "@/lib/repo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Envíos y entregas a todo el país",
  description:
    "Despacho en 24 h hábiles por Andreani y Correo Argentino a todo Argentina, con seguimiento. Envío gratis desde $80.000 y retiro sin cargo en Berazategui.",
  alternates: { canonical: "/ayuda/envios" },
};

export default async function EnviosPage() {
  const settings = await getSettings();

  return (
    <ContentPage
      section="Ayuda"
      sectionHref="/ayuda/faq"
      title="Envíos y entregas"
      intro="Despachamos dentro de las 24 h hábiles de acreditado el pago, por Andreani y Correo Argentino, con código de seguimiento."
    >
      <h2>Plazos por zona</h2>
      <ul>
        {SHIPPING_ZONES.map((zone) => (
          <li key={zone.zone}>
            <strong>{zone.zone}:</strong> {zone.eta}. {zone.note}
          </li>
        ))}
      </ul>

      <h2>Costos</h2>
      <ul>
        <li>
          <strong>{SHIPPING_RATES.andreani.label}:</strong> {formatArs(SHIPPING_RATES.andreani.price)} ·{" "}
          {SHIPPING_RATES.andreani.eta}
        </li>
        <li>
          <strong>{SHIPPING_RATES.correo.label}:</strong> {formatArs(SHIPPING_RATES.correo.price)} ·{" "}
          {SHIPPING_RATES.correo.eta}
        </li>
        <li>
          <strong>{SHIPPING_RATES.pickup.label}:</strong> sin cargo · {SHIPPING_RATES.pickup.eta}
        </li>
      </ul>
      <p>
        <strong>Envío gratis</strong> en todas las compras superiores a {formatArs(settings.freeShippingThresholdArs)},
        a cualquier punto del país.
      </p>

      <h2>Cómo hacemos el seguimiento</h2>
      <p>
        Cuando despachamos te mandamos el número de seguimiento por WhatsApp y por mail. Si el correo no te encuentra,
        el envío queda en la sucursal más cercana durante los días que indique el operador; te avisamos para que puedas
        retirarlo a tiempo.
      </p>

      <h2>Retiro en el local</h2>
      <p>
        Podés retirar sin cargo en Berazategui, GBA Sur, de lunes a sábado de 9 a 18 h. Elegí la opción de retiro en el
        checkout y coordinamos el horario por WhatsApp apenas se acredite el pago. Llevá el número de pedido.
      </p>

      <h2>Productos voluminosos y proyectos</h2>
      <p>
        Para pedidos de varios equipos —edificios, hoteles o flotas— coordinamos la entrega aparte, con remito y en la
        fecha que necesite la obra. Escribinos antes de comprar para que lo organicemos juntos.
      </p>
    </ContentPage>
  );
}
