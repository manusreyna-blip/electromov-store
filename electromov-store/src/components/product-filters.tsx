"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/types";

const SORTS = [
  { value: "relevancia", label: "Más relevantes" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "potencia", label: "Más potencia" },
];

export function ProductFilters({
  categories,
  total,
  showCategories = true,
}: {
  categories: Category[];
  total: number;
  showCategories?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = params.get("categoria") ?? "";
  const sort = params.get("orden") ?? "relevancia";

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  return (
    <div className="flex flex-col gap-4 border-b border-sand-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
      {showCategories ? (
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => setParam("categoria", "")}
            className={`shrink-0 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
              !current ? "border-ink-800 bg-ink-800 text-white" : "border-sand-200 text-sand-600 hover:border-ink-800"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setParam("categoria", cat.slug)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                current === cat.slug
                  ? "border-ink-800 bg-ink-800 text-white"
                  : "border-sand-200 text-sand-600 hover:border-ink-800"
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        <span className="hidden text-[13.5px] text-sand-500 sm:inline">
          {total} {total === 1 ? "producto" : "productos"}
        </span>
        <label className="flex items-center gap-2 rounded-full border border-sand-200 px-3.5 py-2">
          <SlidersHorizontal className="h-4 w-4 text-sand-400" aria-hidden />
          <span className="sr-only">Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setParam("orden", e.target.value === "relevancia" ? "" : e.target.value)}
            className="bg-transparent text-[14px] font-medium text-ink-800 outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
