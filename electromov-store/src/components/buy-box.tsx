"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useCart, type CartLine } from "@/components/cart-provider";
import { formatArs, formatInstallments } from "@/lib/money";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/site";

export function BuyBox({
  line,
  stock,
  maxInstallments,
  freeShippingThreshold,
  productName,
}: {
  line: Omit<CartLine, "qty">;
  stock: number;
  maxInstallments: number;
  freeShippingThreshold: number;
  productName: string;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    track("view_item", {
      currency: "ARS",
      value: line.priceArs,
      items: [
        { item_id: line.sku, item_name: line.name, price: line.priceArs, quantity: 1, item_category: line.category },
      ],
    });
  }, [line]);

  const total = line.priceArs * qty;
  const freeShipping = total >= freeShippingThreshold;

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
      <p className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink-800">
        {formatArs(line.priceArs)}
      </p>
      <p className="mt-2 text-[15px] font-medium text-volt-700">{formatInstallments(line.priceArs, maxInstallments)}</p>
      <p className="mt-1 text-[13px] text-sand-500">Precio final con IVA incluido · Mercado Pago, transferencia o efectivo</p>

      {stock > 0 ? (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-volt-50 px-3 py-1 text-[13px] font-semibold text-volt-800">
          <span className="h-1.5 w-1.5 rounded-full bg-volt-500" /> En stock · despacho en 24 h hábiles
        </p>
      ) : (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1 text-[13px] font-semibold text-sand-600">
          Sin stock · consultanos por reposición
        </p>
      )}

      {stock > 0 ? (
        <>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-sand-200">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand-100"
                aria-label="Quitar una unidad"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-[16px] font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand-100"
                aria-label="Agregar una unidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[13px] text-sand-500">{stock} disponibles</span>
          </div>

          <button
            type="button"
            onClick={() => {
              add(line, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-volt-500 text-base font-semibold text-ink-900 transition-colors hover:bg-volt-400"
          >
            {added ? (
              <>
                <Check className="h-5 w-5" /> Agregado al carrito
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" /> Agregar al carrito
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              add(line, qty);
              track("begin_checkout", {
                currency: "ARS",
                value: total,
                items: [
                  {
                    item_id: line.sku,
                    item_name: line.name,
                    price: line.priceArs,
                    quantity: qty,
                    item_category: line.category,
                  },
                ],
              });
              router.push("/checkout");
            }}
            className="mt-2.5 flex h-13 w-full items-center justify-center rounded-full border border-ink-800 text-base font-semibold text-ink-800 transition-colors hover:bg-ink-800 hover:text-white"
          >
            Comprar ahora
          </button>
        </>
      ) : null}

      <a
        href={waLink(`Hola ElectroMov, quiero consultar por el ${productName}.`)}
        target="_blank"
        rel="noopener"
        onClick={() => track("contact_whatsapp", { location: "pdp", product: line.sku })}
        className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-[15px] font-semibold text-[#052e16]"
      >
        Consultar por WhatsApp
      </a>

      <ul className="mt-5 space-y-2.5 border-t border-sand-200 pt-5">
        <li className="flex items-start gap-2.5 text-[14px] text-sand-600">
          <Truck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-volt-600" aria-hidden />
          {freeShipping ? (
            <span>
              <strong className="text-ink-800">Envío gratis</strong> a todo el país por esta compra
            </span>
          ) : (
            <span>
              Envío a todo el país. Gratis a partir de {formatArs(freeShippingThreshold)}
            </span>
          )}
        </li>
        <li className="flex items-start gap-2.5 text-[14px] text-sand-600">
          <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-volt-600" aria-hidden />
          <span>12 meses de garantía con soporte técnico en Argentina</span>
        </li>
      </ul>
    </div>
  );
}
