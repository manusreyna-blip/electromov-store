import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowUpRight, CircleDollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getSettings, listOrders, listProducts } from "@/lib/repo";
import { formatArs, usdToArs } from "@/lib/money";
import { mpEnabled, mpSandbox } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [products, orders, settings] = await Promise.all([
    listProducts({ includeDrafts: true }),
    listOrders(),
    getSettings(),
  ]);

  const paid = orders.filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered");
  const revenue = paid.reduce((acc, o) => acc + o.totalArs, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stock <= 3);
  const unconfirmedPrices = products.filter((p) => !p.priceConfirmed);
  const published = products.filter((p) => p.status === "published").length;

  const alerts: { tone: "warn" | "info"; text: string; href: string }[] = [];
  if (!mpEnabled)
    alerts.push({
      tone: "warn",
      text: "Mercado Pago todavía no está conectado: los pedidos se registran pero no se cobran online.",
      href: "/admin/configuracion",
    });
  else if (mpSandbox)
    alerts.push({
      tone: "warn",
      text: "Mercado Pago está en modo de prueba (credenciales TEST). Ningún pago es real.",
      href: "/admin/configuracion",
    });
  if (unconfirmedPrices.length)
    alerts.push({
      tone: "warn",
      text: `${unconfirmedPrices.length} producto(s) con precio sin confirmar: ${unconfirmedPrices.map((p) => p.name).join(", ")}.`,
      href: "/admin/productos",
    });
  if (lowStock.length)
    alerts.push({
      tone: "info",
      text: `${lowStock.length} producto(s) con stock bajo (3 o menos unidades).`,
      href: "/admin/productos",
    });

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink-800">Resumen</h1>
      <p className="mt-1.5 text-[15px] text-sand-600">
        Tipo de cambio actual: USD 1 = {formatArs(settings.usdRate)} · actualizado el {settings.usdRateUpdatedAt}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CircleDollarSign, label: "Facturado (pagado)", value: formatArs(revenue) },
          { icon: ShoppingCart, label: "Pedidos totales", value: String(orders.length) },
          { icon: TrendingUp, label: "Pendientes de pago", value: String(pending) },
          { icon: Package, label: "Productos publicados", value: `${published} / ${products.length}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-sand-200 bg-white p-5">
            <Icon className="h-5 w-5 text-volt-600" aria-hidden />
            <p className="mt-3 text-[12.5px] font-semibold uppercase tracking-wide text-sand-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-800">{value}</p>
          </div>
        ))}
      </div>

      {alerts.length > 0 ? (
        <div className="mt-6 space-y-3">
          {alerts.map((alert) => (
            <Link
              key={alert.text}
              href={alert.href}
              className={`flex items-start gap-3 rounded-xl border p-4 text-[14.5px] leading-relaxed transition-colors ${
                alert.tone === "warn"
                  ? "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300"
                  : "border-sand-200 bg-white text-sand-700 hover:border-sand-300"
              }`}
            >
              <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
              <span className="flex-1">{alert.text}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-sand-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink-800">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-[14px] font-semibold text-volt-700">
              Ver todos
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-[14.5px] text-sand-500">Todavía no hay pedidos.</p>
          ) : (
            <ul className="mt-4 divide-y divide-sand-100">
              {orders.slice(0, 6).map((order) => (
                <li key={order.reference} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[13px] text-sand-500">{order.reference}</p>
                    <p className="truncate text-[14.5px] font-medium text-ink-800">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14.5px] font-semibold text-ink-800">{formatArs(order.totalArs)}</p>
                    <p className="text-[12.5px] text-sand-500">{order.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-sand-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink-800">Catálogo</h2>
            <Link href="/admin/productos" className="text-[14px] font-semibold text-volt-700">
              Administrar
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-sand-100">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-medium text-ink-800">{p.name}</p>
                  <p className="text-[12.5px] text-sand-500">
                    {p.stock} en stock · {p.status === "published" ? "publicado" : "borrador"}
                  </p>
                </div>
                <p className="shrink-0 text-[14.5px] font-semibold text-ink-800">
                  {formatArs(usdToArs(p.priceUsd, settings.usdRate))}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
