import type { Metadata } from "next";
import { listProducts, getSettings, listVehicles } from "@/lib/repo";
import { Advisor } from "@/components/advisor";
import { SectionTitle } from "@/components/ui";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Asesor de carga: ¿qué cargador necesito para mi auto eléctrico?",
  description:
    "Respondé cuatro preguntas sobre tu vehículo, tu cochera y tus kilómetros diarios y te decimos exactamente qué cargador necesitás, con la explicación técnica de por qué.",
  alternates: { canonical: "/asesor" },
  openGraph: { url: "/asesor", title: "Asesor de carga para autos eléctricos | ElectroMov" },
};

const FAQS = [
  {
    q: "¿Cómo sé si necesito un Wallbox o me alcanza con un cargador portátil?",
    a: "La regla práctica: si hacés menos de 30 km por día y podés enchufar todas las noches, un EVSE portátil de 3,5 kW te alcanza. Si hacés más de 50 km diarios, tenés dos autos eléctricos o querés cargar rápido, el Wallbox de 7,4 kW es la inversión correcta.",
  },
  {
    q: "¿Qué pasa si vivo en un edificio?",
    a: "Instalar un punto fijo en una cochera de edificio necesita autorización del consorcio y, en general, una línea propia desde el medidor. Mientras se resuelve, el cargador portátil te permite cargar desde el primer día. Si el edificio quiere resolverlo bien, armamos el proyecto completo con medición por usuario.",
  },
  {
    q: "¿El asesor sirve si todavía no compré el auto?",
    a: "Sí. Elegí la opción 'otro vehículo' y te recomendamos según tu lugar de carga y tus kilómetros. Cuando tengas el modelo confirmado, escribinos y ajustamos la recomendación.",
  },
];

export default async function AsesorPage() {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);
  const vehicles = listVehicles();

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Asesor de carga"
        title="¿Qué cargador necesitás realmente?"
        description="Cuatro preguntas, menos de un minuto. Te recomendamos el equipo correcto para tu auto y tu instalación, y te explicamos por qué. Sin venderte de más."
      />

      <div className="mt-10 max-w-4xl">
        <Advisor products={products} vehicles={vehicles} settings={settings} />
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Cómo decidimos la recomendación</h2>
        <div className="prose-em mt-4 text-[16px] text-sand-700">
          <p>
            No hay un cargador mejor que otro: hay un cargador correcto para cada combinación de vehículo, instalación
            eléctrica y kilómetros diarios. El asesor cruza tres variables.
          </p>
          <p>
            <strong>La potencia que acepta tu auto.</strong> De nada sirve un equipo de 11 kW si el cargador de a bordo
            de tu vehículo admite 6,6 kW: vas a pagar de más por una velocidad que nunca vas a usar.
          </p>
          <p>
            <strong>Dónde cargás.</strong> Un equipo fijo necesita pared, tablero accesible y, en un edificio,
            autorización. Si no tenés eso resuelto, el portátil es la respuesta correcta hoy.
          </p>
          <p>
            <strong>Cuánto manejás.</strong> Cargando 10 horas por noche, 3,5 kW te devuelven unos 160 km y 7,4 kW te
            devuelven más de 350 km. Si hacés 40 km por día, el equipo chico te sobra.
          </p>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Asesor de carga", url: "/asesor" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}
