"use client";

import { useEffect } from "react";
import { track, trackAdsConversion, type EcommerceItem } from "@/lib/analytics";
import { useCart } from "@/components/cart-provider";

/**
 * Dispara la conversión una sola vez por referencia de pedido y vacía el carrito.
 * Evita el clásico doble conteo cuando el usuario recarga la página de gracias.
 */
export function PurchaseTracker({
  reference,
  total,
  shipping,
  items,
}: {
  reference: string;
  total: number;
  shipping: number;
  items: EcommerceItem[];
}) {
  const { clear } = useCart();

  useEffect(() => {
    const key = `electromov.purchase.${reference}`;
    let already = false;
    try {
      already = localStorage.getItem(key) === "1";
    } catch {
      /* noop */
    }

    if (!already) {
      track("purchase", { currency: "ARS", value: total, shipping, transaction_id: reference, items });
      trackAdsConversion(total, reference);
      try {
        localStorage.setItem(key, "1");
      } catch {
        /* noop */
      }
    }

    clear();
  }, [reference, total, shipping, items, clear]);

  return null;
}
