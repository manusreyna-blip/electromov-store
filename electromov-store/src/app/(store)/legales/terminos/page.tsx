import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { SITE } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso, compra, pago, envío y garantía de la tienda online de ElectroMov.",
  alternates: { canonical: "/legales/terminos" },
};

export default function TerminosPage() {
  return (
    <ContentPage
      section="Legales"
      sectionHref="/legales/terminos"
      title="Términos y condiciones"
      intro="Condiciones que rigen la compra de productos en electromov.com.ar."
      updatedAt="18 de septiembre de 2026"
    >
      <h2>1. Titularidad</h2>
      <p>
        Este sitio es operado por ElectroMov, con domicilio comercial en {SITE.address.locality}, provincia de{" "}
        {SITE.address.region}, República Argentina. La razón social y el CUIT constan en la factura de cada operación.
      </p>

      <h2>2. Productos y precios</h2>
      <p>
        Los precios se publican en pesos argentinos con IVA incluido y se calculan a partir de un valor de referencia en
        dólares estadounidenses al tipo de cambio vigente al momento de la publicación. Por la volatilidad cambiaria, los
        precios pueden variar sin previo aviso; el precio aplicable es el vigente al momento de confirmar la compra.
      </p>
      <p>
        Las imágenes son ilustrativas. Las especificaciones técnicas publicadas corresponden a la información provista
        por el fabricante y pueden ser actualizadas por este sin aviso previo.
      </p>

      <h2>3. Disponibilidad</h2>
      <p>
        La disponibilidad informada es orientativa. Si por un error de sistema o una venta simultánea un producto no
        estuviera disponible después de confirmada la compra, te lo comunicamos de inmediato y te ofrecemos el reintegro
        total o el reemplazo por un producto equivalente, a tu elección.
      </p>

      <h2>4. Formas de pago</h2>
      <p>
        Aceptamos Mercado Pago (tarjetas de crédito y débito, dinero en cuenta, efectivo en puntos de pago),
        transferencia bancaria y efectivo en nuestro local. Los planes de cuotas sin interés son los que ofrece Mercado
        Pago y sus bancos asociados, y pueden variar. ElectroMov no almacena datos de tarjetas: el procesamiento del pago
        se realiza íntegramente en la plataforma de Mercado Pago.
      </p>

      <h2>5. Facturación</h2>
      <p>
        Emitimos factura electrónica por todas las operaciones. Para factura A es necesario informar el CUIT y la razón
        social antes de la emisión.
      </p>

      <h2>6. Envíos</h2>
      <p>
        Despachamos dentro de las 24 horas hábiles de acreditado el pago, por Andreani o Correo Argentino. Los plazos de
        entrega son estimativos y dependen del operador logístico. El riesgo de la mercadería se transfiere al comprador
        al momento de la entrega.
      </p>

      <h2>7. Garantía</h2>
      <p>
        Todos los productos tienen 12 meses de garantía contra falla de fábrica. La garantía no cubre daños por
        instalación incorrecta, uso indebido, golpes, modificaciones del equipo ni sobretensiones de la red eléctrica sin
        las protecciones indicadas en el manual.
      </p>

      <h2>8. Instalación</h2>
      <p>
        Los equipos de carga fija deben ser instalados por un electricista matriculado, conforme a la reglamentación AEA
        vigente y a las normas municipales aplicables. ElectroMov provee el equipamiento y la documentación técnica; no
        asume responsabilidad por instalaciones realizadas por terceros.
      </p>

      <h2>9. Derecho de arrepentimiento</h2>
      <p>
        Conforme al artículo 34 de la Ley 24.240, tenés derecho a revocar la compra dentro de los 10 días corridos desde
        la recepción del producto, sin costo ni necesidad de expresar el motivo. El producto debe estar sin uso y en su
        embalaje original.
      </p>

      <h2>10. Propiedad intelectual</h2>
      <p>
        Los contenidos de este sitio —textos, imágenes, calculadoras y diseño— son propiedad de ElectroMov y no pueden
        reproducirse sin autorización expresa.
      </p>

      <h2>11. Ley aplicable y jurisdicción</h2>
      <p>
        Estas condiciones se rigen por las leyes de la República Argentina. Ante cualquier controversia son competentes
        los tribunales ordinarios del domicilio del consumidor.
      </p>
    </ContentPage>
  );
}
