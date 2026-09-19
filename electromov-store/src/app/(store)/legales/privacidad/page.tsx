import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { SITE } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos personales recolecta ElectroMov, para qué los usa y cómo ejercer tus derechos.",
  alternates: { canonical: "/legales/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <ContentPage
      section="Legales"
      sectionHref="/legales/terminos"
      title="Política de privacidad"
      intro="Qué datos pedimos, para qué los usamos y cómo pedir que los borremos."
      updatedAt="18 de septiembre de 2026"
    >
      <h2>Qué datos recolectamos</h2>
      <ul>
        <li>
          <strong>Datos de compra:</strong> nombre, email, teléfono, DNI o CUIT y domicilio de entrega. Los necesitamos
          para procesar el pedido, emitir la factura y despachar el envío.
        </li>
        <li>
          <strong>Datos de navegación:</strong> páginas visitadas, origen del tráfico y eventos de compra, a través de
          Google Analytics 4 y, si corresponde, Google Ads y Meta. Solo se activan si aceptás las cookies.
        </li>
      </ul>
      <p>
        <strong>No almacenamos datos de tarjetas.</strong> El pago se procesa íntegramente en los servidores de Mercado
        Pago, que es responsable del tratamiento de esa información.
      </p>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Procesar, facturar y despachar tu pedido, y darte soporte post venta.</li>
        <li>Cumplir obligaciones fiscales y contables.</li>
        <li>Entender cómo se usa el sitio y mejorar la experiencia de compra.</li>
        <li>Enviarte comunicaciones comerciales solo si nos diste tu consentimiento; podés darte de baja cuando quieras.</li>
      </ul>

      <h2>Con quién los compartimos</h2>
      <p>
        Únicamente con los proveedores necesarios para cumplir la operación: Mercado Pago (procesamiento del pago),
        Andreani y Correo Argentino (entrega) y nuestros proveedores de infraestructura y analítica. No vendemos ni
        cedemos datos personales a terceros con fines publicitarios.
      </p>

      <h2>Cookies</h2>
      <p>
        Usamos cookies necesarias para el funcionamiento del carrito y cookies analíticas y publicitarias que solo se
        activan con tu consentimiento, gestionado mediante Consent Mode de Google. Podés revocarlo borrando los datos del
        sitio en tu navegador.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Conforme a la Ley 25.326 de Protección de los Datos Personales, podés acceder, rectificar y suprimir tus datos
        escribiendo a {SITE.email}. El titular de los datos tiene la facultad de ejercer el derecho de acceso de forma
        gratuita a intervalos no inferiores a seis meses, salvo que acredite un interés legítimo.
      </p>
      <p>
        La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la
        atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas
        sobre protección de datos personales.
      </p>

      <h2>Conservación</h2>
      <p>
        Conservamos los datos de las operaciones durante los plazos que exige la normativa fiscal y comercial argentina.
        Pasado ese plazo, se eliminan o anonimizan.
      </p>
    </ContentPage>
  );
}
