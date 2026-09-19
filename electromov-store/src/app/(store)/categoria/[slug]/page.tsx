import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { getCategory, getProductsByCategory, getSettings, listCategories } from "@/lib/repo";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/ui";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { CATEGORIES } from "@/data/catalog";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Categoría no encontrada" };
  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: { canonical: `/categoria/${category.slug}` },
    openGraph: { url: `/categoria/${category.slug}`, title: category.seoTitle, description: category.seoDescription },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const [products, settings] = await Promise.all([getProductsByCategory(slug), getSettings()]);
  const others = listCategories().filter((c) => c.slug !== slug);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav aria-label="Migas de pan" className="mb-6 flex items-center gap-1.5 text-[13px] text-sand-500">
        <Link href="/" className="hover:text-ink-800">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/productos" className="hover:text-ink-800">
          Productos
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-ink-800">{category.shortName}</span>
      </nav>

      <SectionTitle as="h1" eyebrow="Categoría" title={category.name} description={category.description} />

      {products.length === 0 ? (
        <p className="py-20 text-center text-sand-500">Todavía no hay productos publicados en esta categoría.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} settings={settings} priority={i < 3} />
          ))}
        </div>
      )}

      <section className="mt-16 border-t border-sand-200 pt-10">
        <h2 className="text-[15px] font-semibold uppercase tracking-wide text-sand-500">Otras categorías</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className="rounded-full border border-sand-200 px-4 py-2 text-[14.5px] font-medium text-ink-800 transition-colors hover:border-ink-800"
            >
              {c.shortName}
            </Link>
          ))}
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Productos", url: "/productos" },
          { name: category.shortName, url: `/categoria/${category.slug}` },
        ])}
      />
      <JsonLd data={itemListJsonLd(products, settings, category.name)} />
    </div>
  );
}
