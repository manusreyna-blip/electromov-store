import { desc, eq } from "drizzle-orm";
import { db, hasDatabase, schema } from "@/lib/db";
import { ensureSchema } from "@/lib/db/ensure-schema";
import { DEFAULT_SETTINGS, PRODUCTS, VEHICLES, CATEGORIES } from "@/data/catalog";
import type { Order, Product, StoreSettings, Vehicle, Category } from "@/lib/types";

/**
 * Capa de datos con dos modos:
 *  - Con DATABASE_URL  -> Postgres (Neon/Supabase/Vercel Postgres). Todo editable desde /admin.
 *  - Sin DATABASE_URL  -> "modo demo": catálogo del archivo semilla, mutable en memoria.
 *    El sitio funciona completo y se puede probar el panel, pero los cambios se pierden
 *    al reiniciar el servidor. Sirve para deployar sin configurar nada el día 1.
 */
export const demoMode = !hasDatabase;

type MemoryStore = {
  products: Product[];
  settings: StoreSettings;
  orders: Order[];
};

declare global {
  // eslint-disable-next-line no-var
  var __em_memory__: MemoryStore | undefined;
}

function memory(): MemoryStore {
  if (!globalThis.__em_memory__) {
    globalThis.__em_memory__ = {
      products: structuredClone(PRODUCTS),
      settings: { ...DEFAULT_SETTINGS },
      orders: [],
    };
  }
  return globalThis.__em_memory__;
}

/* ---------------------------------- Config --------------------------------- */

export async function getSettings(): Promise<StoreSettings> {
  if (!db) return memory().settings;
  try {
    const rows = await db.select().from(schema.settings).where(eq(schema.settings.key, "store"));
    if (!rows.length) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(rows[0].value as Partial<StoreSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  if (!db) {
    memory().settings = next;
    return next;
  }
  await db
    .insert(schema.settings)
    .values({ key: "store", value: next })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value: next, updatedAt: new Date() } });
  return next;
}

/* --------------------------------- Catálogo -------------------------------- */

function sortProducts(list: Product[]) {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.priceUsd - a.priceUsd;
  });
}

export async function listProducts(opts: { includeDrafts?: boolean } = {}): Promise<Product[]> {
  let rows: Product[];
  if (!db) {
    rows = memory().products;
  } else {
    try {
      const res = await db.select().from(schema.products);
      rows = res.length ? (res as unknown as Product[]) : structuredClone(PRODUCTS);
    } catch {
      rows = structuredClone(PRODUCTS);
    }
  }
  const filtered = opts.includeDrafts ? rows : rows.filter((p) => p.status === "published");
  return sortProducts(filtered);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await listProducts({ includeDrafts: true });
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.categorySlug === categorySlug);
}

export async function upsertProduct(product: Product): Promise<void> {
  if (!db) {
    const mem = memory();
    const idx = mem.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) mem.products[idx] = product;
    else mem.products.push(product);
    return;
  }
  const { ...values } = product;
  await db
    .insert(schema.products)
    .values({ ...values, updatedAt: new Date() } as never)
    .onConflictDoUpdate({
      target: schema.products.id,
      set: { ...values, updatedAt: new Date() } as never,
    });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) {
    const mem = memory();
    mem.products = mem.products.filter((p) => p.id !== id);
    return;
  }
  await db.delete(schema.products).where(eq(schema.products.id, id));
}

/**
 * Crea las tablas si hacen falta y copia el catálogo semilla a la base.
 * Se ejecuta desde el panel la primera vez, así conectar la base no exige
 * correr migraciones desde una terminal.
 */
export async function seedDatabase(): Promise<number> {
  if (!db) return 0;
  await ensureSchema();
  for (const p of PRODUCTS) await upsertProduct(p);
  await saveSettings(DEFAULT_SETTINGS);
  return PRODUCTS.length;
}

/* --------------------------------- Pedidos --------------------------------- */

export async function createOrder(order: Order): Promise<Order> {
  if (!db) {
    memory().orders.unshift(order);
    return order;
  }
  await db.insert(schema.orders).values({ ...order, createdAt: new Date(order.createdAt) } as never);
  return order;
}

export async function listOrders(): Promise<Order[]> {
  if (!db) return memory().orders;
  try {
    const rows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(200);
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })) as unknown as Order[];
  } catch {
    return [];
  }
}

export async function getOrder(reference: string): Promise<Order | null> {
  if (!db) return memory().orders.find((o) => o.reference === reference) ?? null;
  const rows = await db.select().from(schema.orders).where(eq(schema.orders.reference, reference)).limit(1);
  if (!rows.length) return null;
  return { ...rows[0], createdAt: rows[0].createdAt.toISOString() } as unknown as Order;
}

export async function updateOrder(reference: string, patch: Partial<Order>): Promise<void> {
  if (!db) {
    const mem = memory();
    const idx = mem.orders.findIndex((o) => o.reference === reference);
    if (idx >= 0) mem.orders[idx] = { ...mem.orders[idx], ...patch };
    return;
  }
  await db.update(schema.orders).set(patch as never).where(eq(schema.orders.reference, reference));
}

/* ----------------------------- Datos estáticos ----------------------------- */

export function listVehicles(): Vehicle[] {
  return VEHICLES;
}

export function listCategories(): Category[] {
  return CATEGORIES;
}

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
