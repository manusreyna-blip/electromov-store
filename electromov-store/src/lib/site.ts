export const SITE = {
  name: "ElectroMov",
  legalName: "ElectroMov",
  domain: "electromov.com.ar",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://electromov.com.ar",
  tagline: "Cargá tu auto en casa. Gastá 90% menos que con nafta.",
  description:
    "Especialistas 100% en carga de vehículos eléctricos en Argentina. Wallbox, cables Tipo 2, adaptadores y cargadores portátiles con certificación CE, garantía local de 12 meses y envío a todo el país.",
  shortDescription: "Carga para autos eléctricos en Argentina. Wallbox, cables Tipo 2 y portátiles con garantía local.",
  locale: "es_AR",
  lang: "es-AR",
  currency: "ARS",
  country: "AR",
  whatsapp: "5491135330569",
  whatsappDisplay: "+54 9 11 3533-0569",
  email: "hola@electromov.com.ar",
  returnsEmail: "arrepentimiento@electromov.com.ar",
  address: {
    street: "Berazategui",
    locality: "Berazategui",
    region: "Buenos Aires",
    country: "AR",
    zip: "1884",
  },
  geo: { lat: -34.7654, lng: -58.2098 },
  hours: "L–S 9 a 18 h",
  social: {
    instagram: "https://www.instagram.com/electromov.ar",
    tiktok: "https://www.tiktok.com/@electromov",
    youtube: "https://www.youtube.com/@electromov",
  },
  founded: "2024",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { href: "/productos", label: "Productos" },
  { href: "/asesor", label: "Asesor de carga" },
  { href: "/calculadora", label: "Calculá tu ahorro" },
  { href: "/compatibilidad", label: "Compatibilidad" },
  { href: "/b2b", label: "Empresas" },
  { href: "/ayuda/faq", label: "Ayuda" },
];

export const SHIPPING_ZONES = [
  { zone: "CABA y GBA", eta: "24–48 h", note: "Entrega exprés. Retiro sin cargo en Berazategui." },
  { zone: "Interior", eta: "48–96 h", note: "Córdoba, Santa Fe, Mendoza, Rosario y todo el centro del país." },
  { zone: "Patagonia, NOA y NEA", eta: "5–7 días", note: "Cobertura total del territorio nacional." },
];

/** Costos de envío de referencia en ARS. Editables desde el panel en una próxima iteración. */
export const SHIPPING_RATES = {
  pickup: { label: "Retiro en Berazategui", price: 0, eta: "Coordinás por WhatsApp, L–S 9 a 18 h" },
  andreani: { label: "Andreani a domicilio", price: 12900, eta: "24–96 h hábiles según destino" },
  correo: { label: "Correo Argentino a sucursal", price: 8900, eta: "48 h–7 días hábiles según destino" },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_RATES;
