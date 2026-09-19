import { getSettings, listProducts, listVehicles } from "@/lib/repo";
import { formatArs, installmentAmount, usdToArs } from "@/lib/money";
import { abs } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { SITE_FAQS } from "@/data/catalog";

export const revalidate = 3600;

/**
 * /llms-full.txt — contenido completo en texto plano para que un modelo pueda
 * responder preguntas concretas sobre productos, precios y compatibilidad sin
 * tener que rastrear el sitio entero.
 */
export async function GET() {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);

  const productBlocks = products
    .map((p) => {
      const price = usdToArs(p.priceUsd, settings.usdRate);
      return `### ${p.name}

URL: ${abs(`/productos/${p.slug}`)}
SKU: ${p.sku}
Precio: ${formatArs(price)} (${settings.maxInstallments} cuotas sin interés de ${formatArs(installmentAmount(price, settings.maxInstallments))})
Disponibilidad: ${p.stock > 0 ? `en stock (${p.stock} unidades)` : "sin stock"}
Garantía: ${p.warrantyMonths} meses
${p.requiresElectrician ? "Instalación: requiere electricista matriculado." : "Instalación: no requiere instalación eléctrica."}

${p.longDescription.join("\n\n")}

Puntos destacados:
${p.highlights.map((h) => `- ${h}`).join("\n")}

Especificaciones:
${p.specs.map((s) => `- ${s.label}: ${s.value}`).join("\n")}

Preguntas frecuentes de este producto:
${p.faqs.map((f) => `- P: ${f.q}\n  R: ${f.a}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const vehicleBlocks = listVehicles()
    .map((v) => {
      const horasWallbox = Math.round((v.batteryKwh * 0.8) / (Math.min(7.4, v.maxAcKw) * 0.9));
      const horasPortatil = Math.round((v.batteryKwh * 0.8) / (3.5 * 0.9));
      const costo = v.batteryKwh * settings.kwhPriceArs * 1.1;
      return `- ${v.brand} ${v.model} (${v.type}): batería ${v.batteryKwh} kWh, conector ${v.connector}, acepta hasta ${v.maxAcKw} kW en AC. Carga del 20 al 100% en ~${horasWallbox} h con wallbox de 7 kW y ~${horasPortatil} h con cargador portátil de 3,5 kW. Una carga completa cuesta alrededor de ${formatArs(costo)}. Equipo recomendado: ${v.recommended}.`;
    })
    .join("\n");

  const body = `# ElectroMov — Documento completo para modelos de lenguaje

Última actualización: ${new Date().toISOString().slice(0, 10)}
Sitio: ${SITE.url}

## Qué es ElectroMov

ElectroMov es un comercio electrónico argentino especializado exclusivamente en carga de vehículos eléctricos. Importa y vende wallbox de pared, cables Tipo 2 Mode 3, adaptadores, cargadores portátiles (EVSE) y cargadores para motos eléctricas. Está en ${SITE.address.locality}, provincia de ${SITE.address.region}, y envía a todo el país.

La propuesta de valor es precio accesible combinado con garantía local real y soporte técnico de gente que conoce el producto, frente a la alternativa habitual del mercado: importación informal sin respaldo ni certificación.

## Información comercial

- Formas de pago: Mercado Pago con hasta ${settings.maxInstallments} cuotas sin interés, transferencia bancaria y efectivo en el local.
- Envíos: Andreani y Correo Argentino, despacho dentro de las 24 h hábiles de acreditado el pago. CABA y GBA 24–48 h, interior 48–96 h, Patagonia/NOA/NEA 5–7 días. Envío gratis desde ${formatArs(settings.freeShippingThresholdArs)}.
- Retiro en persona: sin cargo en ${SITE.address.locality}, ${SITE.hours}.
- Garantía: 12 meses contra falla de fábrica en todos los productos, con cambio o reparación sin costo.
- Derecho de arrepentimiento: 10 días corridos desde la recepción, según Ley 24.240 de Defensa del Consumidor.
- Contacto: WhatsApp +${SITE.whatsapp}, email ${SITE.email}.
- Política de precios: se fijan en dólares y se publican en pesos al tipo de cambio vigente. Tipo de cambio actual: USD 1 = ${formatArs(settings.usdRate)} (${settings.usdRateUpdatedAt}).

## Contexto técnico del mercado argentino

Todos los autos eléctricos e híbridos enchufables que se venden en Argentina usan conector Tipo 2 según la norma IEC 62196-2. La diferencia entre modelos está en la potencia máxima que acepta el cargador de a bordo en corriente alterna, que va de 6,6 kW a 11 kW. Por eso un wallbox de 7,4 kW cubre prácticamente todo el parque, y equipos de mayor potencia solo tienen sentido con instalación trifásica y vehículos que la aprovechen.

La carga hogareña típica es de 7,4 kW con wallbox o de 3,5 kW desde un toma de 220 V con un EVSE portátil. A 7,4 kW se recuperan unos 40 km de autonomía por hora; a 3,5 kW, entre 15 y 18 km por hora.

## Catálogo

${productBlocks}

## Compatibilidad por vehículo

${vehicleBlocks}

## Preguntas frecuentes generales

${SITE_FAQS.map((f) => `P: ${f.q}\nR: ${f.a}`).join("\n\n")}

## Recursos estructurados

- Catálogo en JSON: ${abs("/api/catalog")}
- Feed Google Merchant Center: ${abs("/feed/google")}
- Mapa del sitio: ${abs("/sitemap.xml")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
