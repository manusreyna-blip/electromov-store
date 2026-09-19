import type { Metadata } from "next";
import Link from "next/link";
import { getSettings, listProducts } from "@/lib/repo";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/ui";
import { waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar productos",
  robots: { index: false, follow: true },
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);

  const query = normalize(q.trim());
  const tokens = query.split(/\s+/).filter(Boolean);
  const results = tokens.length
    ? products.filter((p) => {
        const haystack = normalize(
          `${p.name} ${p.shortDescription} ${p.categorySlug} ${p.keywords.join(" ")} ${p.connectors.join(" ")}`,
        );
        return tokens.every((t) => haystack.includes(t));
      })
    : products;

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Búsqueda"
        title={q ? `Resultados para “${q}”` : "Buscar en el catálogo"}
        description={`${results.length} ${results.length === 1 ? "producto encontrado" : "productos encontrados"}.`}
      />

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-sand-200 bg-sand-50 p-10 text-center">
          <p className="text-[16px] text-sand-600">No encontramos productos que coincidan con tu búsqueda.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/productos"
              className="inline-flex h-11 items-center rounded-full bg-ink-800 px-5 text-[14.5px] font-semibold text-white"
            >
              Ver todo el catálogo
            </Link>
            <a
              href={waLink(`Hola ElectroMov, busco: ${q}`)}
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center rounded-full bg-[#25D366] px-5 text-[14.5px] font-semibold text-[#052e16]"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} settings={settings} />
          ))}
        </div>
      )}
    </div>
  );
}
