import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CircleCheck, FileText, Truck, Wrench } from "lucide-react";

import { getProduct, listProducts, getSettings, getCategory, listVehicles } from "@/lib/repo";
import { usdToArs } from "@/lib/money";
import { Gallery } from "@/components/gallery";
import { BuyBox } from "@/components/buy-box";
import { ChargeSimulator } from "@/components/charge-simulator";
import { ProductCard } from "@/components/product-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, productJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    keywords: product.keywords,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      type: "website",
      url: `/productos/${product.slug}`,
      title: product.seoTitle,
      description: product.seoDescription,
      images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
    },
    other: {
      "product:brand": product.brand,
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings, all] = await Promise.all([getProduct(slug), getSettings(), listProducts()]);

  if (!product || product.status !== "published") notFound();

  const category = getCategory(product.categorySlug);
  const priceArs = usdToArs(product.priceUsd, settings.usdRate);
  const related = all.filter((p) => product.crossSell.includes(p.slug)).slice(0, 3);
  const vehicles = listVehicles();
  const showSimulator = product.categorySlug !== "motos";

  return (
    <article className="container-page py-8 sm:py-12">
      <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-sand-500">
        <Link href="/" className="hover:text-ink-800">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/productos" className="hover:text-ink-800">
          Productos
        </Link>
        {category ? (
          <>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href={`/categoria/${category.slug}`} className="hover:text-ink-800">
              {category.shortName}
            </Link>
          </>
        ) : null}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-ink-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <Gallery images={product.images} badges={product.badges} />

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-volt-700">{product.brand}</p>
          <h1 className="text-balance-title mt-2 text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-800 sm:text-[38px]">
            {product.name}
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-sand-600">{product.tagline}</p>

          <ul className="mt-6 space-y-2.5">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-[15.5px] leading-snug text-ink-800">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-volt-500" aria-hidden />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <BuyBox
              line={{
                slug: product.slug,
                id: product.id,
                name: product.name,
                priceArs,
                image: product.images[0]?.url ?? "",
                sku: product.sku,
                category: product.categorySlug,
              }}
              stock={product.stock}
              maxInstallments={settings.maxInstallments}
              freeShippingThreshold={settings.freeShippingThresholdArs}
              productName={product.name}
            />
          </div>

          {product.requiresElectrician ? (
            <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[14px] leading-relaxed text-amber-900">
              <Wrench className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
              <span>
                Este equipo lo conecta un electricista matriculado a tu tablero. Te pasamos el esquema de instalación y
                te acompañamos durante el proceso.{" "}
                <Link href="/guias/instalar-wallbox" className="font-semibold underline underline-offset-2">
                  Ver la guía de instalación
                </Link>
              </span>
            </p>
          ) : null}
        </div>
      </div>

      {/* Descripción larga + características */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Sobre este producto</h2>
          <div className="prose-em mt-5 text-[16px] text-sand-700">
            {product.longDescription.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-[-0.03em] text-ink-800">Características clave</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f.label} className="rounded-xl border border-sand-200 bg-white p-4">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-sand-500">
                  <span aria-hidden>{f.emoji}</span> {f.label}
                </p>
                <p className="mt-1.5 text-[15px] leading-snug text-ink-800">{f.value}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside>
          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
            <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink-800">
              <FileText className="h-5 w-5 text-volt-600" aria-hidden /> Ficha técnica
            </h2>
            <dl className="mt-4 divide-y divide-sand-200">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-[14px] text-sand-600">{spec.label}</dt>
                  <dd className="text-right text-[14px] font-medium text-ink-800">{spec.value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-6 py-2.5">
                <dt className="text-[14px] text-sand-600">SKU</dt>
                <dd className="text-right font-mono text-[13px] text-ink-800">{product.sku}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 rounded-2xl border border-sand-200 p-6">
            <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink-800">
              <Truck className="h-5 w-5 text-volt-600" aria-hidden /> Envíos y entrega
            </h2>
            <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-sand-600">
              <li>Despacho dentro de las 24 h hábiles de acreditado el pago.</li>
              <li>CABA y GBA en 24–48 h · Interior en 48–96 h · Patagonia, NOA y NEA en 5–7 días.</li>
              <li>Retiro sin cargo en Berazategui, de lunes a sábado de 9 a 18 h.</li>
            </ul>
            <Link
              href="/ayuda/envios"
              className="mt-4 inline-block text-[14px] font-semibold text-volt-700 underline underline-offset-4"
            >
              Ver todas las condiciones de envío
            </Link>
          </div>
        </aside>
      </div>

      {showSimulator ? (
        <section className="mt-16">
          <ChargeSimulator vehicles={vehicles} kwhPriceArs={settings.kwhPriceArs} fixedPowerKw={product.powerKw} />
        </section>
      ) : null}

      <section className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Preguntas sobre este producto</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-sand-600">
            Las consultas más comunes que recibimos sobre el {product.name}.
          </p>
        </div>
        <FaqAccordion faqs={product.faqs} />
      </section>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-800">Se suele comprar junto con</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} settings={settings} />
            ))}
          </div>
        </section>
      ) : null}

      <JsonLd data={productJsonLd(product, settings)} />
      <JsonLd data={faqJsonLd(product.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Productos", url: "/productos" },
          ...(category ? [{ name: category.shortName, url: `/categoria/${category.slug}` }] : []),
          { name: product.name, url: `/productos/${product.slug}` },
        ])}
      />
    </article>
  );
}
