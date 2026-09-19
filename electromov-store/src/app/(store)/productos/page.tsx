import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { listProducts, getSettings, listCategories } from "@/lib/repo";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { SectionTitle } from "@/components/ui";
import type { Product } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catálogo de carga para autos eléctricos",
  description:
    "Wallbox 7 kW, cables Tipo 2 Mode 3, adaptadores Schuko, cargadores portátiles EVSE y carga para motos eléctricas. Certificación CE, garantía local y envío a todo el país.",
  alternates: { canonical: "/productos" },
  openGraph: { url: "/productos", title: "Catálogo de carga para autos eléctricos | ElectroMov" },
};

function sortProducts(products: Product[], orden?: string) {
  const list = [...products];
  switch (orden) {
    case "precio-asc":
      return list.sort((a, b) => a.priceUsd - b.priceUsd);
    case "precio-desc":
      return list.sort((a, b) => b.priceUsd - a.priceUsd);
    case "potencia":
      return list.sort((a, b) => b.powerKw - a.powerKw);
    default:
      return list;
  }
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; orden?: string }>;
}) {
  const { categoria, orden } = await searchParams;
  const [all, settings, categories] = await Promise.all([listProducts(), getSettings(), listCategories()]);

  const filtered = categoria ? all.filter((p) => p.categorySlug === categoria) : all;
  const products = sortProducts(filtered, orden);
  const activeCategory = categories.find((c) => c.slug === categoria);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav aria-label="Migas de pan" className="mb-6 flex items-center gap-2 text-[13px] text-sand-500">
        <Link href="/" className="hover:text-ink-800">
          Inicio
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-800">Productos</span>
      </nav>

      <SectionTitle
        as="h1"
        eyebrow="Catálogo completo"
        title={activeCategory ? activeCategory.name : "Todo para cargar tu vehículo eléctrico"}
        description={
          activeCategory
            ? activeCategory.description
            : "Cada producto está elegido para el mercado argentino: conector Tipo 2, certificación CE e IEC 62196, garantía de 12 meses y repuestos disponibles acá."
        }
      />

      <div className="mt-8">
        <Suspense fallback={<div className="h-16" />}>
          <ProductFilters categories={categories} total={products.length} />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-sand-500">No hay productos en esta categoría todavía.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} settings={settings} priority={i < 3} />
          ))}
        </div>
      )}

      <section className="mt-16 rounded-3xl border border-sand-200 bg-sand-50 p-8 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">¿No sabés cuál elegir?</h2>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-sand-600">
          El asesor de carga te hace cuatro preguntas sobre tu auto, tu instalación y tus kilómetros diarios, y te
          recomienda el equipo correcto con una explicación de por qué. Tarda menos de un minuto.
        </p>
        <Link
          href="/asesor"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-ink-800 px-6 text-[15px] font-semibold text-white hover:bg-ink-700"
        >
          Usar el asesor de carga
        </Link>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Productos", url: "/productos" },
        ])}
      />
      <JsonLd data={itemListJsonLd(products, settings, activeCategory?.name ?? "Catálogo ElectroMov")} />
    </div>
  );
}
