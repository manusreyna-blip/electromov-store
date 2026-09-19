import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContentPage } from "@/components/content-page";
import { SITE, waLink } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por WhatsApp al +54 9 11 3533-0569 o por mail. Estamos en Berazategui, GBA Sur, de lunes a sábado de 9 a 18 h.",
  alternates: { canonical: "/ayuda/contacto" },
};

export default function ContactoPage() {
  return (
    <ContentPage
      section="Ayuda"
      sectionHref="/ayuda/faq"
      title="Contacto"
      intro="Contestamos nosotros, no un bot. Si la consulta es técnica, mejor: es lo que sabemos hacer."
    >
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <a
          href={waLink("Hola ElectroMov, quiero hacer una consulta.")}
          target="_blank"
          rel="noopener"
          className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-5 transition-colors hover:border-ink-800"
        >
          <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden />
          <span>
            <span className="block text-[15.5px] font-semibold text-ink-800">WhatsApp</span>
            <span className="block text-[14px] text-sand-600">{SITE.whatsappDisplay}</span>
            <span className="block text-[13px] text-sand-500">La vía más rápida. Respondemos en horario comercial.</span>
          </span>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-5 transition-colors hover:border-ink-800"
        >
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden />
          <span>
            <span className="block text-[15.5px] font-semibold text-ink-800">Email</span>
            <span className="block text-[14px] text-sand-600">{SITE.email}</span>
            <span className="block text-[13px] text-sand-500">Para presupuestos, facturación y proyectos B2B.</span>
          </span>
        </a>

        <div className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-5">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden />
          <span>
            <span className="block text-[15.5px] font-semibold text-ink-800">Local</span>
            <span className="block text-[14px] text-sand-600">Berazategui, Buenos Aires</span>
            <span className="block text-[13px] text-sand-500">Coordiná la visita por WhatsApp antes de venir.</span>
          </span>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-5">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden />
          <span>
            <span className="block text-[15.5px] font-semibold text-ink-800">Horarios</span>
            <span className="block text-[14px] text-sand-600">{SITE.hours}</span>
            <span className="block text-[13px] text-sand-500">Fuera de horario dejá el mensaje y te contestamos.</span>
          </span>
        </div>
      </div>

      <h2>Antes de escribir</h2>
      <p>
        Si tu consulta es sobre qué equipo comprar, pasá directo por el asesor de carga: en cuatro preguntas te da una
        recomendación fundamentada, y después la validamos juntos. Si es sobre un pedido en curso, tené a mano el número
        de pedido para que podamos buscarlo enseguida.
      </p>

      <h2>Proyectos para empresas</h2>
      <p>
        Para edificios, hoteles o flotas contanos la cantidad de cocheras o vehículos y, si lo sabés, la potencia
        contratada del inmueble. Con eso armamos una primera propuesta técnica sin necesidad de ir al lugar.
      </p>
    </ContentPage>
  );
}
