"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatArs, formatInstallments } from "@/lib/money";
import { track } from "@/lib/analytics";

export function CartDrawer({
  freeShippingThreshold,
  maxInstallments,
}: {
  freeShippingThreshold: number;
  maxInstallments: number;
}) {
  const { lines, isOpen, setOpen, setQty, remove, subtotal, count } = useCart();
  if (!isOpen) return null;

  const missing = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-sand-200 px-5">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink-800">
            <ShoppingBag className="h-5 w-5" />
            Tu carrito {count > 0 ? <span className="text-sand-500">({count})</span> : null}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand-100"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-sand-100">
              <ShoppingBag className="h-7 w-7 text-sand-400" />
            </div>
            <p className="text-[15px] text-sand-600">Todavía no agregaste nada.</p>
            <Link
              href="/productos"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink-800 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-sand-200 px-5 py-4">
              {missing > 0 ? (
                <p className="text-[13px] text-sand-600">
                  Te faltan <strong className="text-ink-800">{formatArs(missing)}</strong> para el envío gratis
                </p>
              ) : (
                <p className="text-[13px] font-semibold text-volt-700">🎉 Tenés envío gratis</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-200">
                <div className="h-full rounded-full bg-volt-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <div key={line.slug} className="flex gap-3 border-b border-sand-100 py-4 last:border-0">
                  <Link
                    href={`/productos/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand-100"
                  >
                    <Image src={line.image} alt={line.name} fill sizes="80px" className="object-contain p-1.5" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/productos/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="block text-[15px] font-medium leading-snug text-ink-800 hover:underline"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-sand-500">{formatArs(line.priceArs)} c/u</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-sand-200">
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand-100"
                          aria-label="Quitar una unidad"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand-100"
                          aria-label="Agregar una unidad"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.slug)}
                        className="grid h-8 w-8 place-items-center rounded-full text-sand-400 hover:bg-sand-100 hover:text-red-600"
                        aria-label={`Eliminar ${line.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sand-200 bg-sand-50 px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] text-sand-600">Subtotal</span>
                <span className="text-2xl font-semibold tracking-tight text-ink-800">{formatArs(subtotal)}</span>
              </div>
              <p className="mt-1 text-[13px] text-volt-700">{formatInstallments(subtotal, maxInstallments)}</p>
              <p className="mt-1 text-xs text-sand-500">El costo de envío se calcula en el checkout.</p>
              <Link
                href="/checkout"
                onClick={() => {
                  setOpen(false);
                  track("begin_checkout", {
                    currency: "ARS",
                    value: subtotal,
                    items: lines.map((l) => ({
                      item_id: l.sku,
                      item_name: l.name,
                      price: l.priceArs,
                      quantity: l.qty,
                      item_category: l.category,
                    })),
                  });
                }}
                className="mt-4 flex h-13 w-full items-center justify-center rounded-full bg-volt-500 text-base font-semibold text-ink-900 transition-colors hover:bg-volt-400"
              >
                Finalizar compra
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 h-10 w-full text-sm font-medium text-sand-600 hover:text-ink-800"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
