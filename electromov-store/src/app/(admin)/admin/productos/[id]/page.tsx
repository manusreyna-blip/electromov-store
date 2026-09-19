import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { listProducts, listCategories } from "@/lib/repo";
import { deleteProductAction, saveProductAction } from "@/app/(admin)/admin/actions";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMPTY: Product = {
  id: "",
  slug: "",
  sku: "",
  name: "",
  seoTitle: "",
  seoDescription: "",
  tagline: "",
  brand: "ElectroMov",
  categorySlug: "wallbox",
  status: "draft",
  featured: false,
  priceUsd: 0,
  compareAtUsd: 0,
  priceConfirmed: false,
  stock: 0,
  shortDescription: "",
  longDescription: [],
  highlights: [],
  features: [],
  specs: [],
  faqs: [],
  images: [],
  badges: [],
  connectors: [],
  keywords: [],
  crossSell: [],
  powerKw: 0,
  amps: 0,
  phases: 1,
  warrantyMonths: 12,
  weightKg: 0,
  requiresElectrician: false,
  mpn: "",
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  step,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  hint?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-800">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
      />
      {hint ? <span className="mt-1 block text-[12.5px] text-sand-500">{hint}</span> : null}
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  hint,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-800">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-sand-200 bg-white p-3 font-mono text-[13.5px] leading-relaxed outline-none focus:border-ink-800"
      />
      {hint ? <span className="mt-1 block text-[12.5px] text-sand-500">{hint}</span> : null}
    </label>
  );
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "nuevo";
  const products = await listProducts({ includeDrafts: true });
  const product = isNew ? EMPTY : products.find((p) => p.id === id);
  const categories = listCategories();

  if (!product) redirect("/admin/productos");

  return (
    <div>
      <Link href="/admin/productos" className="inline-flex items-center gap-2 text-[14px] font-semibold text-sand-600 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>

      <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-ink-800">
        {isNew ? "Nuevo producto" : product.name}
      </h1>

      <form action={saveProductAction} className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <input type="hidden" name="id" defaultValue={product.id} />

        <div className="space-y-6">
          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Información básica</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" name="name" defaultValue={product.name} required />
              <Field label="Slug (URL)" name="slug" defaultValue={product.slug} required hint="Ej: wallbox-7kw-smart" />
              <Field label="SKU" name="sku" defaultValue={product.sku} required />
              <Field label="Marca" name="brand" defaultValue={product.brand} />
              <label className="block">
                <span className="text-[13px] font-semibold text-ink-800">Categoría</span>
                <select
                  name="categorySlug"
                  defaultValue={product.categorySlug}
                  className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.shortName}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="MPN" name="mpn" defaultValue={product.mpn} hint="Código de fabricante para Google Merchant" />
              <div className="sm:col-span-2">
                <Field label="Tagline" name="tagline" defaultValue={product.tagline} hint="Una línea de beneficio principal" />
              </div>
              <div className="sm:col-span-2">
                <Area label="Descripción corta" name="shortDescription" defaultValue={product.shortDescription} rows={2} />
              </div>
              <div className="sm:col-span-2">
                <Area
                  label="Descripción larga"
                  name="longDescription"
                  defaultValue={product.longDescription.join("\n\n")}
                  rows={10}
                  hint="Separá los párrafos con una línea en blanco."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Contenido de la ficha</h2>
            <div className="mt-4 space-y-4">
              <Area
                label="Puntos destacados"
                name="highlights"
                defaultValue={product.highlights.join("\n")}
                rows={4}
                hint="Uno por línea."
              />
              <Area
                label="Características"
                name="features"
                defaultValue={product.features.map((f) => `${f.emoji} ${f.label} | ${f.value}`).join("\n")}
                rows={7}
                hint="Formato: emoji Etiqueta | Valor"
              />
              <Area
                label="Ficha técnica"
                name="specs"
                defaultValue={product.specs.map((s) => `${s.label} | ${s.value}`).join("\n")}
                rows={8}
                hint="Formato: Campo | Valor"
              />
              <Area
                label="Preguntas frecuentes"
                name="faqs"
                defaultValue={product.faqs.map((f) => `${f.q} | ${f.a}`).join("\n")}
                rows={6}
                hint="Formato: Pregunta | Respuesta (se publican como FAQ estructurada para Google)"
              />
              <Area
                label="Imágenes"
                name="images"
                defaultValue={product.images.map((i) => `${i.url} | ${i.alt}`).join("\n")}
                rows={3}
                hint="Formato: /ruta-o-url.jpg | Texto alternativo. Una por línea, la primera es la principal."
              />
            </div>
          </section>

          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">SEO</h2>
            <div className="mt-4 space-y-4">
              <Field label="Título SEO" name="seoTitle" defaultValue={product.seoTitle} hint="Máximo 70 caracteres" />
              <Area label="Meta descripción" name="seoDescription" defaultValue={product.seoDescription} rows={3} hint="Entre 140 y 160 caracteres" />
              <Field label="Palabras clave" name="keywords" defaultValue={product.keywords.join(", ")} hint="Separadas por coma" />
              <Field label="Productos relacionados" name="crossSell" defaultValue={product.crossSell.join(", ")} hint="Slugs separados por coma" />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-sand-200 bg-white p-6 lg:sticky lg:top-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Precio y stock</h2>
            <div className="mt-4 space-y-4">
              <Field label="Precio (USD)" name="priceUsd" type="number" step="0.01" defaultValue={product.priceUsd} required />
              <Field label="Precio tachado (USD)" name="compareAtUsd" type="number" step="0.01" defaultValue={product.compareAtUsd} hint="0 = sin descuento" />
              <Field label="Stock" name="stock" type="number" defaultValue={product.stock} />

              <label className="flex items-center gap-2.5 text-[14px] text-ink-800">
                <input type="checkbox" name="priceConfirmed" defaultChecked={product.priceConfirmed} className="h-4 w-4 accent-[#0b1f17]" />
                Precio confirmado
              </label>
              <label className="flex items-center gap-2.5 text-[14px] text-ink-800">
                <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4 accent-[#0b1f17]" />
                Destacado en la home
              </label>
              <label className="flex items-center gap-2.5 text-[14px] text-ink-800">
                <input type="checkbox" name="requiresElectrician" defaultChecked={product.requiresElectrician} className="h-4 w-4 accent-[#0b1f17]" />
                Requiere electricista matriculado
              </label>

              <label className="block">
                <span className="text-[13px] font-semibold text-ink-800">Estado</span>
                <select
                  name="status"
                  defaultValue={product.status}
                  className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                </select>
              </label>

              <Area label="Badges" name="badges" defaultValue={product.badges.join("\n")} rows={2} hint="Uno por línea. Ej: Más vendido" />
            </div>

            <button
              type="submit"
              className="mt-5 h-12 w-full rounded-full bg-volt-500 text-[15px] font-semibold text-ink-900 hover:bg-volt-400"
            >
              Guardar producto
            </button>
          </section>

          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Datos técnicos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Field label="Potencia (kW)" name="powerKw" type="number" step="0.1" defaultValue={product.powerKw} />
              <Field label="Corriente (A)" name="amps" type="number" defaultValue={product.amps} />
              <Field label="Fases" name="phases" type="number" defaultValue={product.phases} hint="1 o 3" />
              <Field label="Garantía (meses)" name="warrantyMonths" type="number" defaultValue={product.warrantyMonths} />
              <Field label="Peso (kg)" name="weightKg" type="number" step="0.1" defaultValue={product.weightKg} />
              <Field label="Conectores" name="connectors" defaultValue={product.connectors.join(", ")} hint="Separados por coma" />
              <Field label="GTIN / EAN" name="gtin" defaultValue={product.gtin ?? ""} hint="Opcional, mejora Google Shopping" />
            </div>
          </section>
        </aside>
      </form>

      {!isNew ? (
        <form action={deleteProductAction} className="mt-8">
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="slug" value={product.slug} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-[14px] font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Eliminar producto
          </button>
        </form>
      ) : null}
    </div>
  );
}
