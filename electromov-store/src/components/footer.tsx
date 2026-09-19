import Link from "next/link";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Music2, ShieldCheck, Truck, CreditCard, Youtube } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { Logo } from "@/components/logo";

const COLUMNS = [
  {
    title: "Productos",
    links: [
      { href: "/productos", label: "Todo el catálogo" },
      { href: "/categoria/wallbox", label: "Wallbox" },
      { href: "/categoria/cables", label: "Cables Tipo 2" },
      { href: "/categoria/adaptadores", label: "Adaptadores" },
      { href: "/categoria/portatiles", label: "Cargadores portátiles" },
      { href: "/categoria/motos", label: "Carga para motos" },
    ],
  },
  {
    title: "Herramientas",
    links: [
      { href: "/asesor", label: "Asesor de carga" },
      { href: "/calculadora", label: "Calculadora de ahorro" },
      { href: "/compatibilidad", label: "Compatibilidad por vehículo" },
      { href: "/guias/instalar-wallbox", label: "Guía de instalación" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/ayuda/faq", label: "Preguntas frecuentes" },
      { href: "/ayuda/envios", label: "Envíos y entregas" },
      { href: "/ayuda/garantia", label: "Garantía" },
      { href: "/ayuda/contacto", label: "Contacto" },
      { href: "/b2b", label: "Empresas y edificios" },
    ],
  },
  {
    title: "Legales",
    links: [
      { href: "/legales/terminos", label: "Términos y condiciones" },
      { href: "/legales/privacidad", label: "Política de privacidad" },
      { href: "/legales/cambios-devoluciones", label: "Cambios y devoluciones" },
      { href: "/legales/boton-arrepentimiento", label: "Botón de arrepentimiento" },
    ],
  },
];

const TRUST = [
  { icon: ShieldCheck, title: "Garantía 12 meses", text: "Certificación CE e IEC 62196 en todos los productos" },
  { icon: Truck, title: "Envío a todo el país", text: "Despacho en 24 h hábiles por Andreani y Correo Argentino" },
  { icon: CreditCard, title: "12 cuotas sin interés", text: "Mercado Pago, transferencia o efectivo en el local" },
  { icon: MessageCircle, title: "Soporte técnico real", text: "Te atiende alguien que conoce el producto" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sand-200 bg-sand-50">
      <div className="container-page">
        <div className="grid gap-6 border-b border-sand-200 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden />
              <div>
                <p className="text-[15px] font-semibold text-ink-800">{title}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-sand-600">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_3fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-sand-600">
              Especialistas 100% en carga de vehículos eléctricos. Importamos, asesoramos y damos soporte real en
              Argentina.
            </p>
            <div className="mt-5 space-y-2 text-[14px] text-sand-600">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sand-400" /> {SITE.address.locality}, GBA Sur
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sand-400" /> {SITE.hours}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sand-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-ink-800">
                  {SITE.email}
                </a>
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <a
                href={waLink("Hola ElectroMov, quiero hacer una consulta.")}
                target="_blank"
                rel="noopener"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-[#052e16]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              {[
                { href: SITE.social.instagram, label: "Instagram de ElectroMov", Icon: Instagram },
                { href: SITE.social.tiktok, label: "TikTok de ElectroMov", Icon: Music2 },
                { href: SITE.social.youtube, label: "YouTube de ElectroMov", Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="grid h-10 w-10 place-items-center rounded-full border border-sand-200 text-ink-800 hover:border-ink-800"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink-800">{col.title}</h3>
                <ul className="mt-3.5 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[14px] text-sand-600 transition-colors hover:text-ink-800">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-sand-200 py-7 text-[13px] text-sand-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados. CUIT y razón social disponibles en
            factura.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/legales/boton-arrepentimiento" className="underline underline-offset-4 hover:text-ink-800">
              Botón de arrepentimiento
            </Link>
            <span className="hidden sm:inline">·</span>
            <span>Defensa de las y los consumidores.</span>
            <a
              href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
              target="_blank"
              rel="noopener nofollow"
              className="underline underline-offset-4 hover:text-ink-800"
            >
              Para reclamos ingresá acá
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
