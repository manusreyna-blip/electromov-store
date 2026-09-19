import type { MetadataRoute } from "next";
import { listProducts, listCategories, listVehicles } from "@/lib/repo";
import { abs } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: abs("/productos"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: abs("/asesor"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/calculadora"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/compatibilidad"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/b2b"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/guias/instalar-wallbox"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/ayuda/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/ayuda/envios"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/ayuda/garantia"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/ayuda/contacto"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/legales/terminos"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/legales/privacidad"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/legales/cambios-devoluciones"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/legales/boton-arrepentimiento"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = listCategories().map((c) => ({
    url: abs(`/categoria/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: abs(`/productos/${p.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
    images: p.images.map((i) => abs(i.url)),
  }));

  const vehiclePages: MetadataRoute.Sitemap = listVehicles().map((v) => ({
    url: abs(`/compatibilidad/${v.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...vehiclePages];
}
