"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart, type CartLine } from "@/components/cart-provider";

export function QuickAdd({ line, disabled }: { line: Omit<CartLine, "qty">; disabled?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <span className="flex h-11 w-full items-center justify-center rounded-full border border-sand-200 text-sm font-semibold text-sand-400">
        Sin stock
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(line);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-ink-800 bg-white text-sm font-semibold text-ink-800 transition-all hover:bg-ink-800 hover:text-white"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Agregado
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> Agregar al carrito
        </>
      )}
    </button>
  );
}
