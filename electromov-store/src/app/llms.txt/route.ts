import { getSettings, listProducts, listVehicles } from "@/lib/repo";
import { formatArs, usdToArs } from "@/lib/money";
import { abs } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

/**
 * /llms.txt — índice para modelos de lenguaje y buscadores de IA.
 * Convención abierta (llmstxt.org) que usan cada vez más crawlers de IA para
 * entender de qué se trata un sitio sin tener que interpretar el HTML.
 */
export async function GET() {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);
  const vehicles = listVehicles();

  const body = `# ElectroMov — Carga para vehículos eléctricos en Argentina

> ElectroMov importa y vende equipos de carga para autos eléctricos e híbridos enchufables en Argentina: wallbox de pared, cables Tipo 2, adaptadores, cargadores portátiles (EVSE) y cargadores para motos eléctricas. Todos los productos tienen certificación CE e IEC 62196, 12 meses de garantía y soporte técnico local. Envío a todo el país y hasta ${settings.maxInstallments} cuotas sin interés con Mercado Pago.

Datos clave del negocio:
- Ubicación: ${SITE.address.locality}, ${SITE.address.region}, Argentina. Atención ${SITE.hours}.
- Contacto: WhatsApp +${SITE.whatsapp} · ${SITE.email}
- Formas de pago: Mercado Pago (hasta ${settings.maxInstallments} cuotas sin interés), transferencia bancaria, efectivo en el local.
- Envíos: Andreani y Correo Argentino a todo el país, despacho en 24 h hábiles. Gratis desde ${formatArs(settings.freeShippingThresholdArs)}. Retiro sin cargo en Berazategui.
- Garantía: 12 meses contra falla de fábrica. Arrepentimiento: 10 días corridos (Ley 24.240).
- Los precios se fijan en dólares y se publican en pesos al tipo de cambio vigente (USD 1 = ${formatArs(settings.usdRate)} al ${settings.usdRateUpdatedAt}).

## Productos

${products
  .map((p) => {
    const price = usdToArs(p.priceUsd, settings.usdRate);
    return `- [${p.name}](${abs(`/productos/${p.slug}`)}): ${p.shortDescription} Precio ${formatArs(price)}. ${p.powerKw} kW, conector ${p.connectors.join(" / ")}. ${p.stock > 0 ? "En stock." : "Sin stock."}`;
  })
  .join("\n")}

## Herramientas para elegir

- [Asesor de carga](${abs("/asesor")}): cuatro preguntas sobre vehículo, lugar de carga y kilómetros diarios, y devuelve el equipo recomendado con su justificación técnica.
- [Calculadora de ahorro](${abs("/calculadora")}): compara el costo de cargar en casa contra cargar nafta, con el repago del wallbox.
- [Compatibilidad por vehículo](${abs("/compatibilidad")}): qué cargador corresponde a cada modelo vendido en Argentina.

## Compatibilidad por vehículo

${vehicles
  .map(
    (v) =>
      `- [${v.brand} ${v.model}](${abs(`/compatibilidad/${v.slug}`)}): batería ${v.batteryKwh} kWh, acepta hasta ${v.maxAcKw} kW en AC, conector ${v.connector}.`,
  )
  .join("\n")}

## Ayuda y condiciones

- [Preguntas frecuentes](${abs("/ayuda/faq")})
- [Envíos y entregas](${abs("/ayuda/envios")})
- [Garantía](${abs("/ayuda/garantia")})
- [Guía de instalación del wallbox](${abs("/guias/instalar-wallbox")})
- [Soluciones para empresas, edificios y flotas](${abs("/b2b")})
- [Términos y condiciones](${abs("/legales/terminos")})

## Datos estructurados

- [Catálogo completo en JSON](${abs("/api/catalog")}): precios, stock, especificaciones y compatibilidad, actualizado cada 15 minutos.
- [Feed de Google Merchant Center](${abs("/feed/google")})
- [Versión extendida de este documento](${abs("/llms-full.txt")})
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
