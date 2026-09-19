import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CirclePlus, Pencil } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getSettings, listProducts } from "@/lib/repo";
import { formatArs, usdToArs } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; deleted?: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { ok, deleted } = await searchParams;
  const [products, settings] = await Promise.all([listProducts({ includeDrafts: true }), getSettings()]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink-800">Productos</h1>
          <p className="mt-1.5 text-[15px] text-sand-600">
            Los precios se cargan en dólares y la tienda los muestra en pesos al tipo de cambio configurado.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-800 px-5 text-[14.5px] font-semibold text-white hover:bg-ink-700"
        >
          <CirclePlus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      {ok ? (
        <p className="mt-5 rounded-xl border border-volt-200 bg-volt-50 p-3.5 text-[14px] text-volt-900">
          Producto guardado. Los cambios ya están publicados en la tienda.
        </p>
      ) : null}
      {deleted ? (
        <p className="mt-5 rounded-xl border border-sand-200 bg-white p-3.5 text-[14px] text-sand-700">
          Producto eliminado.
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-sand-200 bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-sand-200 bg-sand-50 text-[12.5px] uppercase tracking-wide text-sand-500">
              <th scope="col" className="px-4 py-3 font-semibold">Producto</th>
              <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Precio USD</th>
              <th scope="col" className="px-4 py-3 font-semibold">Precio ARS</th>
              <th scope="col" className="px-4 py-3 font-semibold">Stock</th>
              <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">Estado</th>
              <th scope="col" className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100 text-[14.5px]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-sand-50">
                <th scope="row" className="px-4 py-3 font-normal">
                  <span className="flex items-center gap-3">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                      {p.images[0] ? (
                        <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-contain p-1" />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-800">{p.name}</span>
                      <span className="block font-mono text-[12px] text-sand-500">{p.sku}</span>
                    </span>
                  </span>
                </th>
                <td className="hidden px-4 py-3 text-sand-600 sm:table-cell">
                  USD {p.priceUsd}
                  {!p.priceConfirmed ? (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                      revisar
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-medium text-ink-800">{formatArs(usdToArs(p.priceUsd, settings.usdRate))}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 3 ? "font-semibold text-amber-700" : "text-sand-600"}>{p.stock}</span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                      p.status === "published" ? "bg-volt-50 text-volt-800" : "bg-sand-100 text-sand-600"
                    }`}
                  >
                    {p.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 px-3 py-1.5 text-[13.5px] font-semibold text-ink-800 hover:border-ink-800"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
