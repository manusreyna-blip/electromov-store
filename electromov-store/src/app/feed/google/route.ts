import { getSettings, listProducts, listCategories } from "@/lib/repo";
import { usdToArs } from "@/lib/money";
import { abs } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Feed RSS 2.0 para Google Merchant Center (Shopping y campañas Performance Max).
 * Cargar en Merchant Center > Productos > Fuentes: https://electromov.com.ar/feed/google
 */
export async function GET() {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);
  const categories = listCategories();

  const items = products
    .map((p) => {
      const price = usdToArs(p.priceUsd, settings.usdRate);
      const category = categories.find((c) => c.slug === p.categorySlug);
      const shipping = price >= settings.freeShippingThresholdArs ? 0 : 12900;

      return `    <item>
      <g:id>${escapeXml(p.sku)}</g:id>
      <g:title>${escapeXml(p.seoTitle || p.name)}</g:title>
      <g:description>${escapeXml(p.shortDescription)}</g:description>
      <g:link>${abs(`/productos/${p.slug}`)}</g:link>
      <g:image_link>${abs(p.images[0]?.url ?? "/opengraph-image")}</g:image_link>
${p.images
  .slice(1)
  .map((i) => `      <g:additional_image_link>${abs(i.url)}</g:additional_image_link>`)
  .join("\n")}
      <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${price}.00 ARS</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(p.brand)}</g:brand>
      <g:mpn>${escapeXml(p.mpn)}</g:mpn>
      ${p.gtin ? `<g:gtin>${escapeXml(p.gtin)}</g:gtin>` : "<g:identifier_exists>no</g:identifier_exists>"}
      <g:product_type>${escapeXml(category?.name ?? "Carga eléctrica")}</g:product_type>
      <g:google_product_category>5613</g:google_product_category>
      <g:shipping>
        <g:country>AR</g:country>
        <g:service>Estándar</g:service>
        <g:price>${shipping}.00 ARS</g:price>
      </g:shipping>
      <g:shipping_weight>${p.weightKg} kg</g:shipping_weight>
      <g:product_highlight>${escapeXml(p.highlights[0] ?? "")}</g:product_highlight>
      <g:custom_label_0>${escapeXml(p.categorySlug)}</g:custom_label_0>
      <g:custom_label_1>${p.featured ? "destacado" : "estandar"}</g:custom_label_1>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE.name)} — Catálogo</title>
    <link>${SITE.url}</link>
    <description>${escapeXml(SITE.shortDescription)}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
