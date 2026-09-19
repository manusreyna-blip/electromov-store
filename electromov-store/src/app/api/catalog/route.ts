import { getSettings, listProducts, listCategories, listVehicles } from "@/lib/repo";
import { usdToArs, installmentAmount } from "@/lib/money";
import { abs } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { SITE_FAQS } from "@/data/catalog";

export const revalidate = 900;

/**
 * Catálogo legible por máquinas: pensado para agentes y buscadores de IA
 * (ChatGPT, Perplexity, Gemini, Claude) y para cualquier integración externa.
 * Documentado en /llms.txt y habilitado por CORS para que puedan consumirlo.
 */
export async function GET() {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);

  const payload = {
    "@context": "https://schema.org",
    generatedAt: new Date().toISOString(),
    store: {
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      country: "AR",
      currency: "ARS",
      whatsapp: `+${SITE.whatsapp}`,
      email: SITE.email,
      address: `${SITE.address.locality}, ${SITE.address.region}, Argentina`,
      hours: SITE.hours,
      shipping: "Envío a todo Argentina por Andreani y Correo Argentino. Gratis desde $80.000. Retiro en Berazategui.",
      payment: `Mercado Pago (hasta ${settings.maxInstallments} cuotas sin interés), transferencia bancaria y efectivo en el local.`,
      warranty: "12 meses contra falla de fábrica en todos los productos, con soporte técnico en Argentina.",
      returns: "10 días corridos de arrepentimiento según Ley 24.240 de Defensa del Consumidor.",
    },
    pricing: {
      note: "Los precios se fijan en dólares y se publican en pesos al tipo de cambio vigente.",
      usdRate: settings.usdRate,
      usdRateUpdatedAt: settings.usdRateUpdatedAt,
    },
    categories: listCategories().map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      url: abs(`/categoria/${c.slug}`),
    })),
    products: products.map((p) => {
      const priceArs = usdToArs(p.priceUsd, settings.usdRate);
      return {
        sku: p.sku,
        name: p.name,
        category: p.categorySlug,
        url: abs(`/productos/${p.slug}`),
        image: abs(p.images[0]?.url ?? "/opengraph-image"),
        summary: p.shortDescription,
        description: p.longDescription.join(" "),
        priceArs,
        installments: {
          count: settings.maxInstallments,
          amountArs: installmentAmount(priceArs, settings.maxInstallments),
          interestFree: true,
        },
        availability: p.stock > 0 ? "in_stock" : "out_of_stock",
        specs: Object.fromEntries(p.specs.map((s) => [s.label, s.value])),
        highlights: p.highlights,
        connectors: p.connectors,
        powerKw: p.powerKw,
        warrantyMonths: p.warrantyMonths,
        requiresElectrician: p.requiresElectrician,
        faqs: p.faqs,
      };
    }),
    vehicleCompatibility: listVehicles().map((v) => ({
      vehicle: `${v.brand} ${v.model}`,
      url: abs(`/compatibilidad/${v.slug}`),
      batteryKwh: v.batteryKwh,
      maxAcChargingKw: v.maxAcKw,
      connector: v.connector,
      recommendedProduct: abs(`/productos/${v.recommended}`),
    })),
    faqs: SITE_FAQS,
    tools: [
      { name: "Asesor de carga", url: abs("/asesor"), description: "Recomienda el equipo correcto en cuatro preguntas." },
      { name: "Calculadora de ahorro", url: abs("/calculadora"), description: "Compara el costo de cargar contra el de cargar nafta." },
      { name: "Compatibilidad por vehículo", url: abs("/compatibilidad"), description: "Qué cargador corresponde a cada auto eléctrico." },
    ],
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
