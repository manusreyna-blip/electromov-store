import { getSettings, listProducts } from "@/lib/repo";
import { usdToArs } from "@/lib/money";
import { abs } from "@/lib/seo";

export const revalidate = 3600;

function csvCell(value: string | number) {
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Catálogo CSV para Meta (Instagram Shopping y campañas Advantage+).
 * Cargar en Commerce Manager > Catálogo > Fuentes de datos > URL programada:
 * https://electromov.com.ar/feed/meta
 */
export async function GET() {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "google_product_category",
    "product_type",
    "inventory",
  ];

  const rows = products.map((p) => {
    const price = usdToArs(p.priceUsd, settings.usdRate);
    return [
      p.sku,
      p.seoTitle || p.name,
      p.shortDescription,
      p.stock > 0 ? "in stock" : "out of stock",
      "new",
      `${price}.00 ARS`,
      abs(`/productos/${p.slug}`),
      abs(p.images[0]?.url ?? "/opengraph-image"),
      p.brand,
      "5613",
      p.categorySlug,
      p.stock,
    ]
      .map(csvCell)
      .join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="electromov-catalogo.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
