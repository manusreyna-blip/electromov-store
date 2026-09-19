import crypto from "node:crypto";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { SITE } from "@/lib/site";
import type { Order } from "@/lib/types";

const accessToken = process.env.MP_ACCESS_TOKEN ?? "";
export const mpEnabled = Boolean(accessToken);
export const mpPublicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "";

/** true cuando las credenciales son de prueba (TEST-...). Se muestra un aviso en el checkout. */
export const mpSandbox = accessToken.startsWith("TEST-") || mpPublicKey.startsWith("TEST-");

function client() {
  if (!accessToken) throw new Error("MP_ACCESS_TOKEN no está configurado");
  return new MercadoPagoConfig({
    accessToken,
    options: { timeout: 8000, idempotencyKey: crypto.randomUUID() },
  });
}

export async function createPreference(order: Order) {
  const preference = new Preference(client());
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

  const result = await preference.create({
    body: {
      items: order.items.map((item) => ({
        id: item.slug,
        title: item.name,
        quantity: item.qty,
        unit_price: item.unitPriceArs,
        currency_id: "ARS",
        category_id: "electronics",
      })),
      payer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: { number: order.customerPhone },
        identification: order.customerDoc ? { type: "DNI", number: order.customerDoc } : undefined,
      },
      shipments:
        order.shippingArs > 0
          ? {
              cost: order.shippingArs,
              mode: "not_specified",
              receiver_address: {
                zip_code: order.shippingZip,
                street_name: order.shippingAddress,
                city_name: order.shippingCity,
                state_name: order.shippingProvince,
              },
            }
          : undefined,
      back_urls: {
        success: `${baseUrl}/checkout/resultado?ref=${order.reference}&status=success`,
        failure: `${baseUrl}/checkout/resultado?ref=${order.reference}&status=failure`,
        pending: `${baseUrl}/checkout/resultado?ref=${order.reference}&status=pending`,
      },
      auto_return: "approved",
      external_reference: order.reference,
      statement_descriptor: "ELECTROMOV",
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      payment_methods: {
        installments: Number(process.env.MP_MAX_INSTALLMENTS ?? 12),
        excluded_payment_types: [],
      },
      metadata: { reference: order.reference, source: "storefront" },
      expires: false,
    },
  });

  return { id: result.id ?? "", initPoint: result.init_point ?? result.sandbox_init_point ?? "" };
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(client());
  return payment.get({ id: paymentId });
}

/**
 * Valida la firma del webhook (header x-signature) según el esquema de Mercado Pago.
 * Sin MP_WEBHOOK_SECRET configurado devuelve true para no bloquear el desarrollo,
 * pero en producción hay que definirlo sí o sí.
 */
export function verifyWebhookSignature({
  signature,
  requestId,
  dataId,
}: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
}) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signature || !dataId) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    }),
  ) as { ts?: string; v1?: string };

  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${dataId};request-id:${requestId ?? ""};ts:${parts.ts};`;
  const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export function mapPaymentStatus(status?: string): Order["status"] {
  switch (status) {
    case "approved":
      return "paid";
    case "rejected":
    case "cancelled":
      return "rejected";
    default:
      return "pending";
  }
}
