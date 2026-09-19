import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getSettings, listProducts } from "@/lib/repo";
import { usdToArs } from "@/lib/money";
import { SHIPPING_RATES } from "@/lib/site";
import { createPreference, mpEnabled } from "@/lib/mercadopago";
import type { Order, OrderItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  customerName: z.string().min(2).max(160),
  customerEmail: z.email().max(160),
  customerPhone: z.string().min(6).max(60),
  customerDoc: z.string().max(40).default(""),
  shippingMethod: z.enum(["pickup", "andreani", "correo"]),
  shippingAddress: z.string().max(240).default(""),
  shippingCity: z.string().max(120).default(""),
  shippingZip: z.string().max(20).default(""),
  shippingProvince: z.string().max(80).default(""),
  notes: z.string().max(600).default(""),
  items: z.array(z.object({ slug: z.string(), qty: z.number().int().min(1).max(20) })).min(1).max(20),
});

function reference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `EM-${stamp}${rand}`;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos incompletos", detail: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  // Los precios SIEMPRE se recalculan en el servidor: nunca se confía en el carrito del cliente.
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);

  const items: OrderItem[] = [];
  for (const line of data.items) {
    const product = products.find((p) => p.slug === line.slug);
    if (!product) return NextResponse.json({ error: `Producto no disponible: ${line.slug}` }, { status: 409 });
    if (product.stock < line.qty) {
      return NextResponse.json({ error: `Sin stock suficiente de ${product.name}` }, { status: 409 });
    }
    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      qty: line.qty,
      unitPriceArs: usdToArs(product.priceUsd, settings.usdRate),
    });
  }

  const subtotalArs = items.reduce((acc, item) => acc + item.unitPriceArs * item.qty, 0);
  const baseShipping = SHIPPING_RATES[data.shippingMethod].price;
  const shippingArs = subtotalArs >= settings.freeShippingThresholdArs ? 0 : baseShipping;
  const totalArs = subtotalArs + shippingArs;

  const order: Order = {
    id: crypto.randomUUID(),
    reference: reference(),
    createdAt: new Date().toISOString(),
    status: "pending",
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    customerDoc: data.customerDoc,
    shippingMethod: data.shippingMethod,
    shippingAddress: data.shippingAddress,
    shippingCity: data.shippingCity,
    shippingZip: data.shippingZip,
    shippingProvince: data.shippingProvince,
    notes: data.notes,
    items,
    subtotalArs,
    shippingArs,
    totalArs,
    usdRate: settings.usdRate,
    mpPreferenceId: "",
    mpPaymentId: "",
    paymentMethod: "",
    installments: 0,
  };

  if (mpEnabled) {
    try {
      const preference = await createPreference(order);
      order.mpPreferenceId = preference.id;
      await createOrder(order);
      return NextResponse.json({
        reference: order.reference,
        totalArs,
        shippingArs,
        preferenceId: preference.id,
        initPoint: preference.initPoint,
        mode: "mercadopago",
      });
    } catch (error) {
      console.error("[checkout] Error creando preferencia de Mercado Pago:", error);
      await createOrder(order);
      return NextResponse.json(
        {
          reference: order.reference,
          totalArs,
          shippingArs,
          mode: "manual",
          warning: "No pudimos abrir el pago online. El pedido quedó registrado y te contactamos para coordinarlo.",
        },
        { status: 200 },
      );
    }
  }

  // Sin credenciales de Mercado Pago: el pedido se registra y se coordina por WhatsApp/transferencia.
  await createOrder(order);
  return NextResponse.json({ reference: order.reference, totalArs, shippingArs, mode: "manual" });
}
