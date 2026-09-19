import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { JsonLd, faqJsonLd, howToJsonLd } from "@/lib/seo";
import { FaqAccordion } from "@/components/faq-accordion";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Cómo instalar un wallbox en casa: guía paso a paso",
  description:
    "Qué necesita la instalación de un wallbox de 7 kW en Argentina: sección de cable, térmica, disyuntor diferencial, puesta a tierra y qué le tenés que pedir a tu electricista matriculado.",
  alternates: { canonical: "/guias/instalar-wallbox" },
  openGraph: { url: "/guias/instalar-wallbox", title: "Guía de instalación de wallbox | ElectroMov" },
};

const STEPS = [
  {
    name: "Verificar la potencia disponible",
    text: "Mirá la térmica principal de tu casa y la potencia contratada con la distribuidora. Un wallbox de 7,4 kW suma 32 A: si tu instalación está al límite, hay que evaluar un aumento de carga o configurar el equipo a menor amperaje.",
  },
  {
    name: "Elegir el punto de montaje",
    text: "El wallbox va en la pared, a entre 1,20 y 1,50 m del piso, en un lugar donde el cable llegue cómodo al puerto de carga del auto sin quedar tenso ni apoyado en el piso. Cuanto más cerca del tablero, más barata la instalación.",
  },
  {
    name: "Tirar la línea dedicada",
    text: "Se lleva una línea propia desde el tablero hasta el wallbox, con cable de 6 mm² para 32 A en tiradas de hasta 20 metros. No se comparte con otros consumos: es el punto que más problemas evita a futuro.",
  },
  {
    name: "Colocar las protecciones",
    text: "Térmica de 40 A curva C y disyuntor diferencial de 30 mA tipo A en el tablero, exclusivos para esa línea. El wallbox ya trae detección de fuga de corriente continua de 6 mA, que es lo que permite usar un diferencial tipo A en lugar de uno tipo B.",
  },
  {
    name: "Verificar la puesta a tierra",
    text: "El equipo no carga si no detecta una tierra en condiciones, y hace bien. Si la casa es vieja y no tiene jabalina, hay que instalarla: es parte del trabajo y no es negociable.",
  },
  {
    name: "Montar, conectar y configurar",
    text: "Se fija el wallbox, se conecta la línea, se energiza y se configura el amperaje máximo y la red WiFi desde la app. Al final se hace una carga de prueba con el auto verificando temperatura y consumo.",
  },
];

const FAQS = [
  {
    q: "¿Cuánto sale la instalación?",
    a: "Depende sobre todo de la distancia entre el tablero y el lugar del wallbox, y de si hace falta mejorar la puesta a tierra. Una instalación típica de cochera con el tablero cerca es un trabajo de 2 a 3 horas para un electricista matriculado. Pedí siempre presupuesto con materiales incluidos.",
  },
  {
    q: "¿Puedo instalarlo yo mismo?",
    a: "No es recomendable y anula la garantía del equipo. La conexión al tablero tiene que hacerla un electricista matriculado: no es solo por la garantía, es porque una línea de 32 A mal dimensionada es un riesgo de incendio real.",
  },
  {
    q: "¿Necesito aumentar la potencia contratada?",
    a: "No siempre. Si tu casa tiene una acometida monofásica estándar y no hacés funcionar todo a la vez, el balance dinámico del wallbox resuelve el problema bajando la potencia de carga cuando el resto de la casa consume. Si ya venís justo, conviene evaluar el aumento.",
  },
  {
    q: "¿Qué pasa si vivo en un edificio?",
    a: "Necesitás autorización del consorcio y, en general, una línea desde tu propio medidor hasta la cochera. Es el punto más burocrático de todo el proceso. Si el edificio quiere resolverlo para varios propietarios a la vez, conviene hacer un proyecto único con balance de carga.",
  },
];

export default function GuiaPage() {
  return (
    <>
      <ContentPage
        section="Guías"
        sectionHref="/guias/instalar-wallbox"
        title="Cómo instalar un wallbox en casa"
        intro="Lo que tenés que saber antes de llamar al electricista, y lo que le tenés que pedir para que quede bien hecho."
      >
        <p>
          Instalar un wallbox no es complicado, pero sí es una instalación eléctrica seria: un equipo de 7,4 kW que
          trabaja seis u ocho horas seguidas todas las noches exige mucho más que un electrodoméstico común. La mayoría
          de los problemas que vemos no son del cargador: son de instalaciones improvisadas.
        </p>

        <h2>Los seis pasos</h2>
        <ol>
          {STEPS.map((step) => (
            <li key={step.name}>
              <strong>{step.name}.</strong> {step.text}
            </li>
          ))}
        </ol>

        <h2>Checklist para pasarle a tu electricista</h2>
        <ul>
          <li>Línea dedicada desde el tablero, cable de cobre de 6 mm² para 32 A (hasta 20 m de tirada).</li>
          <li>Térmica bipolar de 40 A curva C exclusiva para el wallbox.</li>
          <li>Disyuntor diferencial de 30 mA tipo A exclusivo para esa línea.</li>
          <li>Puesta a tierra verificada, con medición de resistencia.</li>
          <li>Montaje a 1,20–1,50 m del piso, con el recorrido del cable protegido.</li>
          <li>Prueba de carga real con el vehículo antes de dar por terminado el trabajo.</li>
        </ul>

        <h2>Errores que vemos seguido</h2>
        <p>
          <strong>Colgarse de una línea existente.</strong> Es la causa número uno de térmicas que saltan y de cables que
          se calientan. La línea tiene que ser propia.
        </p>
        <p>
          <strong>Usar prolongaciones o zapatillas.</strong> No están dimensionadas para esta corriente sostenida. Si
          necesitás distancia, la solución es correr la línea, no alargar el cable.
        </p>
        <p>
          <strong>Ignorar la puesta a tierra.</strong> El equipo se va a negar a cargar, y tiene razón: sin tierra, una
          falla de aislación termina en el chasis del auto.
        </p>

        <p>
          ¿Dudas con tu caso puntual?{" "}
          <Link href="/ayuda/contacto">Escribinos con una foto del tablero</Link> y te decimos qué hace falta antes de
          que compres.
        </p>

        <div className="not-prose mt-10">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Preguntas sobre la instalación</h2>
          <div className="mt-5">
            <FaqAccordion faqs={FAQS} />
          </div>
        </div>
      </ContentPage>

      <JsonLd
        data={howToJsonLd(
          "Cómo instalar un wallbox de 7 kW en casa",
          "Pasos y requisitos eléctricos para instalar un cargador de pared para auto eléctrico en Argentina.",
          STEPS,
        )}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
    </>
  );
}
