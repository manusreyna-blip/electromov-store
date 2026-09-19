import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listOrders } from "@/lib/repo";
import { formatArs } from "@/lib/money";
import { updateOrderStatusAction } from "@/app/(admin)/admin/actions";
import { SHIPPING_RATES } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-800" },
  paid: { label: "Pagado", className: "bg-volt-50 text-volt-800" },
  shipped: { label: "Enviado", className: "bg-sky-50 text-sky-800" },
  delivered: { label: "Entregado", className: "bg-sand-100 text-sand-700" },
  rejected: { label: "Rechazado", className: "bg-red-50 text-red-700" },
  cancelled: { label: "Cancelado", className: "bg-sand-100 text-sand-600" },
};

export default async function AdminOrdersPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const orders = await listOrders();

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink-800">Pedidos</h1>
      <p className="mt-1.5 text-[15px] text-sand-600">
        El estado se actualiza solo cuando Mercado Pago confirma el pago. Después lo movés a enviado o entregado a mano.
      </p>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-sand-200 bg-white p-10 text-center text-[15px] text-sand-500">
          Todavía no hay pedidos.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
            return (
              <article key={order.reference} className="rounded-2xl border border-sand-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[13px] text-sand-500">{order.reference}</p>
                    <h2 className="mt-0.5 text-[17px] font-semibold text-ink-800">{order.customerName}</h2>
                    <p className="text-[14px] text-sand-600">
                      {order.customerEmail} · {order.customerPhone}
                      {order.customerDoc ? ` · DNI/CUIT ${order.customerDoc}` : ""}
                    </p>
                    <p className="mt-1 text-[13px] text-sand-500">
                      {new Date(order.createdAt).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-ink-800">{formatArs(order.totalArs)}</p>
                    {order.mpPaymentId ? (
                      <p className="text-[12px] text-sand-500">Pago MP {order.mpPaymentId}</p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 border-t border-sand-100 pt-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-sand-500">Productos</h3>
                    <ul className="mt-2 space-y-1.5 text-[14px]">
                      {order.items.map((item) => (
                        <li key={item.slug} className="flex justify-between gap-4">
                          <span className="text-sand-700">
                            {item.qty} × {item.name}
                          </span>
                          <span className="font-medium text-ink-800">{formatArs(item.unitPriceArs * item.qty)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between gap-4 border-t border-sand-100 pt-1.5">
                        <span className="text-sand-700">Envío</span>
                        <span className="font-medium text-ink-800">
                          {order.shippingArs === 0 ? "Gratis" : formatArs(order.shippingArs)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-sand-500">Entrega</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-sand-700">
                      {SHIPPING_RATES[order.shippingMethod]?.label ?? order.shippingMethod}
                      {order.shippingMethod !== "pickup" ? (
                        <>
                          <br />
                          {order.shippingAddress}, {order.shippingCity} ({order.shippingZip}), {order.shippingProvince}
                        </>
                      ) : null}
                      {order.notes ? (
                        <>
                          <br />
                          <span className="text-sand-500">Nota: {order.notes}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                <form action={updateOrderStatusAction} className="mt-4 flex flex-wrap items-center gap-3 border-t border-sand-100 pt-4">
                  <input type="hidden" name="reference" value={order.reference} />
                  <label className="text-[13px] font-semibold text-ink-800">
                    Cambiar estado
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="ml-2 h-10 rounded-xl border border-sand-200 bg-white px-3 text-[14px] font-normal outline-none focus:border-ink-800"
                    >
                      {Object.entries(STATUS_LABEL).map(([value, meta]) => (
                        <option key={value} value={value}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="h-10 rounded-full bg-ink-800 px-4 text-[14px] font-semibold text-white hover:bg-ink-700"
                  >
                    Guardar
                  </button>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener"
                    className="h-10 rounded-full border border-sand-200 px-4 text-[14px] font-semibold leading-10 text-ink-800 hover:border-ink-800"
                  >
                    Escribirle
                  </a>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
