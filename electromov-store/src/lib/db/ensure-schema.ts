import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Crea las tablas si no existen. Se ejecuta desde el panel al tocar
 * "Cargar catálogo inicial", así conectar la base no requiere correr
 * migraciones a mano desde una terminal.
 *
 * Es idempotente: se puede ejecutar todas las veces que haga falta.
 * Para cambios de esquema más adelante, usar `npm run db:push`.
 */
export async function ensureSchema(): Promise<void> {
  if (!db) return;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id varchar(64) PRIMARY KEY,
      slug varchar(160) NOT NULL UNIQUE,
      sku varchar(64) NOT NULL DEFAULT '',
      name varchar(200) NOT NULL DEFAULT '',
      seo_title varchar(200) NOT NULL DEFAULT '',
      seo_description text NOT NULL DEFAULT '',
      tagline text NOT NULL DEFAULT '',
      brand varchar(80) NOT NULL DEFAULT 'ElectroMov',
      category_slug varchar(80) NOT NULL DEFAULT 'wallbox',
      status varchar(20) NOT NULL DEFAULT 'published',
      featured boolean NOT NULL DEFAULT false,
      price_usd real NOT NULL DEFAULT 0,
      compare_at_usd real NOT NULL DEFAULT 0,
      price_confirmed boolean NOT NULL DEFAULT false,
      stock integer NOT NULL DEFAULT 0,
      short_description text NOT NULL DEFAULT '',
      long_description json NOT NULL DEFAULT '[]'::json,
      highlights json NOT NULL DEFAULT '[]'::json,
      features json NOT NULL DEFAULT '[]'::json,
      specs json NOT NULL DEFAULT '[]'::json,
      faqs json NOT NULL DEFAULT '[]'::json,
      images json NOT NULL DEFAULT '[]'::json,
      badges json NOT NULL DEFAULT '[]'::json,
      connectors json NOT NULL DEFAULT '[]'::json,
      keywords json NOT NULL DEFAULT '[]'::json,
      cross_sell json NOT NULL DEFAULT '[]'::json,
      power_kw real NOT NULL DEFAULT 0,
      amps integer NOT NULL DEFAULT 0,
      phases integer NOT NULL DEFAULT 1,
      warranty_months integer NOT NULL DEFAULT 12,
      weight_kg real NOT NULL DEFAULT 0,
      requires_electrician boolean NOT NULL DEFAULT false,
      gtin varchar(32),
      mpn varchar(64) NOT NULL DEFAULT '',
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS settings (
      key varchar(64) PRIMARY KEY,
      value json NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id varchar(64) PRIMARY KEY,
      reference varchar(32) NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now(),
      status varchar(24) NOT NULL DEFAULT 'pending',
      customer_name varchar(160) NOT NULL DEFAULT '',
      customer_email varchar(160) NOT NULL DEFAULT '',
      customer_phone varchar(60) NOT NULL DEFAULT '',
      customer_doc varchar(40) NOT NULL DEFAULT '',
      shipping_method varchar(24) NOT NULL DEFAULT 'pickup',
      shipping_address text NOT NULL DEFAULT '',
      shipping_city varchar(120) NOT NULL DEFAULT '',
      shipping_zip varchar(20) NOT NULL DEFAULT '',
      shipping_province varchar(80) NOT NULL DEFAULT '',
      notes text NOT NULL DEFAULT '',
      items json NOT NULL DEFAULT '[]'::json,
      subtotal_ars integer NOT NULL DEFAULT 0,
      shipping_ars integer NOT NULL DEFAULT 0,
      total_ars integer NOT NULL DEFAULT 0,
      usd_rate real NOT NULL DEFAULT 0,
      mp_preference_id varchar(120) NOT NULL DEFAULT '',
      mp_payment_id varchar(120) NOT NULL DEFAULT '',
      payment_method varchar(60) NOT NULL DEFAULT '',
      installments integer NOT NULL DEFAULT 1
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS leads (
      id varchar(64) PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      source varchar(60) NOT NULL DEFAULT 'asesor',
      name varchar(160) NOT NULL DEFAULT '',
      email varchar(160) NOT NULL DEFAULT '',
      phone varchar(60) NOT NULL DEFAULT '',
      payload json NOT NULL DEFAULT '{}'::json
    )
  `);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_slug)`);
}
