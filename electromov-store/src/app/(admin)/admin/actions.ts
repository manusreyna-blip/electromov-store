"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import { deleteProduct, getProduct, listProducts, saveSettings, seedDatabase, updateOrder, upsertProduct } from "@/lib/repo";
import type { Product } from "@/lib/types";

async function assertAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function revalidateStore(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/productos");
  if (slug) revalidatePath(`/productos/${slug}`);
}

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Contraseña incorrecta" };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parsePairs(value: FormDataEntryValue | null, separator = "|") {
  return parseLines(value).map((line) => {
    const [head, ...rest] = line.split(separator);
    return { left: head.trim(), right: rest.join(separator).trim() };
  });
}

export async function saveProductAction(formData: FormData) {
  await assertAuth();

  const id = String(formData.get("id") ?? "").trim();
  const existing = id ? (await listProducts({ includeDrafts: true })).find((p) => p.id === id) : null;
  const slug = String(formData.get("slug") ?? "").trim();

  const product: Product = {
    id: id || `p-${slug || crypto.randomUUID().slice(0, 8)}`,
    slug,
    sku: String(formData.get("sku") ?? ""),
    name: String(formData.get("name") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    brand: String(formData.get("brand") ?? "ElectroMov"),
    categorySlug: String(formData.get("categorySlug") ?? "wallbox"),
    status: formData.get("status") === "published" ? "published" : "draft",
    featured: formData.get("featured") === "on",
    priceUsd: Number(formData.get("priceUsd") ?? 0),
    compareAtUsd: Number(formData.get("compareAtUsd") ?? 0),
    priceConfirmed: formData.get("priceConfirmed") === "on",
    stock: Number(formData.get("stock") ?? 0),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    longDescription: String(formData.get("longDescription") ?? "")
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean),
    highlights: parseLines(formData.get("highlights")),
    features: parsePairs(formData.get("features")).map(({ left, right }) => {
      const [emoji, ...label] = left.split(" ");
      return { emoji: emoji || "⚡", label: label.join(" ") || left, value: right };
    }),
    specs: parsePairs(formData.get("specs")).map(({ left, right }) => ({ label: left, value: right })),
    faqs: parsePairs(formData.get("faqs")).map(({ left, right }) => ({ q: left, a: right })),
    images: parsePairs(formData.get("images")).map(({ left, right }) => ({ url: left, alt: right || left })),
    badges: parseLines(formData.get("badges")),
    connectors: String(formData.get("connectors") ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    keywords: String(formData.get("keywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    crossSell: String(formData.get("crossSell") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    powerKw: Number(formData.get("powerKw") ?? 0),
    amps: Number(formData.get("amps") ?? 0),
    phases: Number(formData.get("phases") ?? 1) === 3 ? 3 : 1,
    warrantyMonths: Number(formData.get("warrantyMonths") ?? 12),
    weightKg: Number(formData.get("weightKg") ?? 0),
    requiresElectrician: formData.get("requiresElectrician") === "on",
    gtin: String(formData.get("gtin") ?? "") || undefined,
    mpn: String(formData.get("mpn") ?? "") || String(formData.get("sku") ?? ""),
  };

  if (existing) {
    product.images = product.images.length ? product.images : existing.images;
  }

  await upsertProduct(product);
  revalidateStore(product.slug);
  redirect("/admin/productos?ok=1");
}

export async function deleteProductAction(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id") ?? "");
  const product = await getProduct(String(formData.get("slug") ?? ""));
  await deleteProduct(id);
  revalidateStore(product?.slug);
  redirect("/admin/productos?deleted=1");
}

export async function saveSettingsAction(formData: FormData) {
  await assertAuth();
  await saveSettings({
    usdRate: Number(formData.get("usdRate") ?? 0),
    usdRateUpdatedAt: new Date().toISOString().slice(0, 10),
    maxInstallments: Number(formData.get("maxInstallments") ?? 12),
    freeShippingThresholdArs: Number(formData.get("freeShippingThresholdArs") ?? 0),
    kwhPriceArs: Number(formData.get("kwhPriceArs") ?? 0),
    fuelPriceArs: Number(formData.get("fuelPriceArs") ?? 0),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    announcement: String(formData.get("announcement") ?? ""),
    announcementEnabled: formData.get("announcementEnabled") === "on",
  });
  revalidateStore();
  redirect("/admin/configuracion?ok=1");
}

export async function seedAction() {
  await assertAuth();
  const count = await seedDatabase();
  revalidateStore();
  redirect(`/admin/configuracion?seeded=${count}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  await assertAuth();
  const reference = String(formData.get("reference") ?? "");
  const status = String(formData.get("status") ?? "pending") as
    | "pending"
    | "paid"
    | "rejected"
    | "cancelled"
    | "shipped"
    | "delivered";
  await updateOrder(reference, { status });
  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos?ok=1");
}
