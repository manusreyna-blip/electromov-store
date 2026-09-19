import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Garantía de 12 meses con soporte local",
  description:
    "Todos los productos de ElectroMov tienen 12 meses de garantía contra falla de fábrica, con cambio o reparación sin costo y soporte técnico en Argentina.",
  alternates: { canonical: "/ayuda/garantia" },
};

export default function GarantiaPage() {
  return (
    <ContentPage
      section="Ayuda"
      sectionHref="/ayuda/faq"
      title="Garantía"
      intro="12 meses contra falla de fábrica en todos los productos, con cambio o reparación sin costo y soporte técnico real en Argentina."
    >
      <h2>Qué cubre</h2>
      <p>
        La garantía cubre cualquier falla de fabricación del equipo durante los 12 meses posteriores a la compra: fallas
        electrónicas, de los contactos, del display, de la conectividad o de las protecciones. Si el equipo falla por un
        defecto propio, lo cambiamos o lo reparamos sin cargo.
      </p>

      <h2>Qué no cubre</h2>
      <ul>
        <li>Daños por instalación incorrecta o hecha por alguien sin matrícula habilitante.</li>
        <li>Daños por sobretensión de la red cuando el equipo estaba conectado sin las protecciones que indica el manual.</li>
        <li>Golpes, caídas, cortes del cable o intentos de apertura o modificación del equipo.</li>
        <li>Desgaste normal de la funda o del cable por uso intensivo.</li>
      </ul>

      <h2>Cómo se hace efectiva</h2>
      <ol>
        <li>Escribinos por WhatsApp con el número de pedido y contanos qué pasa. Pedinos que te guiemos: muchas veces se resuelve en el momento.</li>
        <li>Si hace falta revisarlo, coordinamos que nos llegue el equipo. Si estás en el AMBA, lo retiramos.</li>
        <li>Verificada la falla, reemplazamos el equipo o lo reparamos. Te avisamos el plazo apenas lo diagnosticamos.</li>
      </ol>

      <h2>Certificaciones</h2>
      <p>
        Todos los equipos cumplen las normas IEC 62196 (conectores) e IEC 61851 (sistemas de carga conductiva) y tienen
        certificación CE. Es lo que diferencia a un producto de carga serio de un cable importado sin respaldo: las
        protecciones contra fuga de corriente continua y sobretemperatura existen justamente para que una falla del auto
        o de la red no termine en la instalación de tu casa.
      </p>

      <h2>Derecho de arrepentimiento</h2>
      <p>
        Independientemente de la garantía, tenés 10 días corridos desde que recibís el producto para arrepentirte de la
        compra sin costo ni justificación, según la Ley 24.240 de Defensa del Consumidor.
      </p>
    </ContentPage>
  );
}
