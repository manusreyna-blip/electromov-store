import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { SITE } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  description:
    "Tenés 10 días corridos para arrepentirte de tu compra sin costo, según la Ley 24.240. Así se hace el cambio o la devolución en ElectroMov.",
  alternates: { canonical: "/legales/cambios-devoluciones" },
};

export default function CambiosPage() {
  return (
    <ContentPage
      section="Legales"
      sectionHref="/legales/terminos"
      title="Cambios y devoluciones"
      intro="Diez días corridos para arrepentirte, sin costo y sin tener que explicar por qué."
      updatedAt="18 de septiembre de 2026"
    >
      <h2>Derecho de arrepentimiento</h2>
      <p>
        Según el artículo 34 de la Ley 24.240 de Defensa del Consumidor, tenés 10 días corridos desde que recibís el
        producto para revocar la compra. No tenés que justificar el motivo y el costo de la devolución corre por nuestra
        cuenta. El producto tiene que estar sin uso y en su embalaje original.
      </p>

      <h2>Cómo iniciarlo</h2>
      <ol>
        <li>
          Usá el <Link href="/legales/boton-arrepentimiento">botón de arrepentimiento</Link> o escribinos a {SITE.returnsEmail} con
          tu número de pedido.
        </li>
        <li>Te confirmamos la recepción del pedido de revocación dentro de las 24 h hábiles.</li>
        <li>Coordinamos el retiro del producto o te enviamos una etiqueta de devolución, según tu ubicación.</li>
        <li>Recibido el producto y verificado su estado, hacemos el reintegro por la misma vía de pago original.</li>
      </ol>

      <h2>Cambios por otro producto</h2>
      <p>
        Si compraste un equipo y necesitás otro —por ejemplo, arrancaste con el portátil y querés pasar al wallbox—
        hacemos el cambio dentro de los 10 días tomando el producto a cuenta, siempre que esté sin uso. La diferencia se
        abona o se reintegra según corresponda.
      </p>

      <h2>Productos con falla</h2>
      <p>
        Si el producto llegó fallado o falla dentro de los 12 meses de garantía, no corre el plazo de 10 días: aplica la
        garantía, con cambio o reparación sin costo. Escribinos y lo resolvemos.
      </p>

      <h2>Plazos de reintegro</h2>
      <p>
        El reintegro se procesa dentro de los 10 días hábiles de recibido el producto. Si pagaste con tarjeta, el
        acreditamiento depende de los plazos del banco emisor y de Mercado Pago.
      </p>
    </ContentPage>
  );
}
