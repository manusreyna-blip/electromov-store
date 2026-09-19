import { NextResponse } from "next/server";
import { getPayment, mapPaymentStatus, mpEnabled, verifyWebhookSignature } from "@/lib/mercadopago";
import { getOrder, updateOrder } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook de Mercado Pago (IPN v2).
 * Configurar en el panel de MP: https://<dominio>/api/webhooks/mercadopago
 * Eventos: "Pagos". Guardar la clave secreta en MP_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  let body: { type?: string; action?: string; data?: { id?: string } } = {};
  try {
    body = await request.json();
  } catch {
    /* Mercado Pago a veces notifica solo por query string */
  }

  const dataId = body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const type = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");

  const valid = verifyWebhookSignature({
    signature: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId,
  });

  if (!valid) {
    console.warn("[mp-webhook] Firma inválida");
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  // Respondemos 200 siempre que la firma sea válida: MP reintenta ante cualquier otro código.
  if (type !== "payment" || !dataId || !mpEnabled) {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getPayment(dataId);
    const reference = payment.external_reference;
    if (!reference) return NextResponse.json({ received: true });

    const order = await getOrder(reference);
    if (!order) {
      console.warn(`[mp-webhook] Pedido ${reference} no encontrado`);
      return NextResponse.json({ received: true });
    }

    await updateOrder(reference, {
      status: mapPaymentStatus(payment.status),
      mpPaymentId: String(payment.id ?? ""),
      paymentMethod: payment.payment_method_id ?? "",
      installments: payment.installments ?? 1,
    });

    console.info(`[mp-webhook] Pedido ${reference} actualizado a ${payment.status}`);
  } catch (error) {
    console.error("[mp-webhook] Error procesando el pago:", error);
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "mercadopago-webhook" });
}
