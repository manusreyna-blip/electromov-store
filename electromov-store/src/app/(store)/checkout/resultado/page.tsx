import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { getOrder } from "@/lib/repo";
import { formatArs } from "@/lib/money";
import { waLink } from "@/lib/site";
import { PurchaseTracker } from "@/components/purchase-tracker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resultado del pago",
  robots: { index: false, follow: false },
};

const COPY = {
  success: {
    icon: CheckCircle2,
    tone: "border-volt-200 bg-volt-50 text-volt-700",
    title: "¡Listo! Recibimos tu pago",
    text: "Te mandamos el comprobante por mail. Despachamos el pedido dentro de las 24 h hábiles y te pasamos el seguimiento por WhatsApp.",
  },
  pending: {
    icon: Clock,
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    title: "Tu pago está en proceso",
    text: "Mercado Pago todavía está confirmando la operación. Es normal cuando pagás en efectivo o por transferencia: apenas se acredite, preparamos el envío.",
  },
  failure: {
    icon: AlertTriangle,
    tone: "border-red-200 bg-red-50 text-red-700",
    title: "No pudimos procesar el pago",
    text: "No se hizo ningún cargo. Podés intentar con otro medio de pago o escribirnos y lo resolvemos juntos.",
  },
} as const;

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; status?: string }>;
}) {
  const { ref, status } = await searchParams;
  const key = (status === "success" || status === "pending" || status === "failure" ? status : "pending") as keyof typeof COPY;
  const copy = COPY[key];
  const Icon = copy.icon;
  const order = ref ? await getOrder(ref) : null;

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className={`inline-grid h-16 w-16 place-items-center rounded-full border ${copy.tone}`}>
          <Icon className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-6 text-[32px] font-semibold tracking-[-0.035em] text-ink-800 sm:text-[38px]">{copy.title}</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-sand-600">{copy.text}</p>

        {order ? (
          <div className="mt-8 rounded-2xl border border-sand-200 bg-white p-6 text-left">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold uppercase tracking-wide text-sand-500">Pedido</span>
              <span className="font-mono text-[15px] font-semibold text-ink-800">{order.reference}</span>
            </div>
            <ul className="mt-4 space-y-2 border-t border-sand-200 pt-4">
              {order.items.map((item) => (
                <li key={item.slug} className="flex justify-between gap-4 text-[14.5px]">
                  <span className="text-sand-600">
                    {item.qty} × {item.name}
                  </span>
                  <span className="font-medium text-ink-800">{formatArs(item.unitPriceArs * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-sand-200 pt-4">
              <span className="text-[15px] font-semibold text-ink-800">Total</span>
              <span className="text-[19px] font-semibold text-ink-800">{formatArs(order.totalArs)}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/productos"
            className="inline-flex h-12 items-center rounded-full bg-ink-800 px-6 text-[15px] font-semibold text-white hover:bg-ink-700"
          >
            Seguir comprando
          </Link>
          <a
            href={waLink(`Hola ElectroMov, consulto por el pedido ${ref ?? ""}.`)}
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center rounded-full border border-sand-200 px-6 text-[15px] font-semibold text-ink-800 hover:border-ink-800"
          >
            Escribirnos por WhatsApp
          </a>
        </div>
      </div>

      {key === "success" && order ? (
        <PurchaseTracker
          reference={order.reference}
          total={order.totalArs}
          shipping={order.shippingArs}
          items={order.items.map((i) => ({
            item_id: i.slug,
            item_name: i.name,
            price: i.unitPriceArs,
            quantity: i.qty,
          }))}
        />
      ) : null}
    </div>
  );
}
