import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { RegretForm } from "@/components/regret-form";
import { SITE } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Botón de arrepentimiento",
  description:
    "Ejercé tu derecho de arrepentimiento dentro de los 10 días corridos de recibida la compra, sin costo, según la Ley 24.240 y la Resolución 424/2020.",
  alternates: { canonical: "/legales/boton-arrepentimiento" },
};

export default function BotonArrepentimientoPage() {
  return (
    <ContentPage
      section="Legales"
      sectionHref="/legales/terminos"
      title="Botón de arrepentimiento"
      intro="Completá el formulario y tu solicitud de revocación queda iniciada. Te confirmamos dentro de las 24 h hábiles."
    >
      <p>
        De acuerdo con el artículo 34 de la Ley 24.240 y la Resolución 424/2020 de la Secretaría de Comercio Interior,
        podés revocar tu compra dentro de los 10 días corridos desde la recepción del producto, sin costo alguno y sin
        necesidad de expresar el motivo. El producto debe estar sin uso y en su embalaje original.
      </p>

      <div className="not-prose my-8">
        <RegretForm email={SITE.returnsEmail} whatsapp={SITE.whatsapp} />
      </div>

      <p>
        También podés ejercer este derecho escribiendo a <strong>{SITE.returnsEmail}</strong> o por WhatsApp al{" "}
        <strong>{SITE.whatsappDisplay}</strong>, indicando tu número de pedido.
      </p>
    </ContentPage>
  );
}
