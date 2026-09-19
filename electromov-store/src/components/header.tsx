"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X, Zap } from "lucide-react";
import { NAV, SITE, waLink } from "@/lib/site";
import { Logo } from "@/components/logo";
import { useCart } from "@/components/cart-provider";
import { formatArs } from "@/lib/money";
import { track } from "@/lib/analytics";

export type SearchItem = {
  slug: string;
  name: string;
  category: string;
  priceArs: number;
  image: string;
  keywords: string[];
};

export function Header({ items, announcement }: { items: SearchItem[]; announcement: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, setOpen } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {announcement ? (
        <div className="bg-ink-800 text-volt-200">
          <div className="container-page flex h-9 items-center justify-center gap-2 overflow-hidden text-[13px] font-medium">
            <Zap className="h-3.5 w-3.5 shrink-0 text-volt-400" aria-hidden />
            <span className="truncate">{announcement}</span>
          </div>
        </div>
      ) : null}

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? "border-sand-200 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
            : "border-transparent bg-white"
        }`}
      >
        <div className="container-page flex h-16 items-center gap-3 sm:h-[68px]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-ink-800 hover:bg-sand-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 pr-2" aria-label="ElectroMov, inicio">
            <Logo />
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Principal">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors ${
                    active ? "bg-sand-100 text-ink-800" : "text-sand-600 hover:bg-sand-50 hover:text-ink-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 items-center gap-2 rounded-full border border-sand-200 px-3.5 text-sm text-sand-500 transition-colors hover:border-sand-300 hover:text-ink-800 md:flex"
              aria-label="Buscar productos"
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
              <kbd className="ml-2 rounded border border-sand-200 bg-sand-50 px-1.5 py-0.5 font-mono text-[10px] text-sand-500">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-800 hover:bg-sand-100 md:hidden"
              aria-label="Buscar productos"
            >
              <Search className="h-5 w-5" />
            </button>

            <a
              href={waLink("Hola ElectroMov, tengo una consulta sobre carga para mi auto eléctrico.")}
              target="_blank"
              rel="noopener"
              onClick={() => track("contact_whatsapp", { location: "header" })}
              className="hidden h-10 items-center rounded-full border border-sand-200 px-4 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-800 xl:inline-flex"
            >
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-800 hover:bg-sand-100"
              aria-label={`Abrir carrito, ${count} productos`}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-volt-500 px-1 text-[11px] font-bold text-ink-900">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} /> : null}
      {searchOpen ? <SearchDialog items={items} onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-sand-200 px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand-100"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Menú móvil">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] font-medium text-ink-800 hover:bg-sand-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sand-200 p-4">
          <a
            href={waLink("Hola ElectroMov, quiero asesoramiento para cargar mi auto eléctrico.")}
            target="_blank"
            rel="noopener"
            className="flex h-12 items-center justify-center rounded-full bg-[#25D366] font-semibold text-[#052e16]"
          >
            Escribinos por WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-sand-500">
            {SITE.whatsappDisplay} · {SITE.hours}
          </p>
        </div>
      </div>
    </div>
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function SearchDialog({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return items.slice(0, 5);
    const tokens = q.split(/\s+/);
    return items
      .map((item) => {
        const haystack = normalize(`${item.name} ${item.category} ${item.keywords.join(" ")}`);
        const score = tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.item);
  }, [items, query]);

  useEffect(() => {
    if (!query.trim()) return;
    const id = setTimeout(() => track("search", { search_term: query.trim() }), 700);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <div className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-[8vh] w-[94%] max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-sand-200 px-4">
          <Search className="h-5 w-5 shrink-0 text-sand-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar wallbox, cable Tipo 2, adaptador…"
            className="h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-sand-400"
          />
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-sand-100" aria-label="Cerrar">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-sand-500">No encontramos nada con “{query}”.</p>
              <a
                href={waLink(`Hola, busco: ${query}`)}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-block text-sm font-semibold text-volt-700 underline underline-offset-4"
              >
                Preguntanos por WhatsApp
              </a>
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.slug}
                href={`/productos/${item.slug}`}
                className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-sand-50"
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-ink-800">{item.name}</span>
                  <span className="block text-xs text-sand-500">{item.category}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-ink-800">{formatArs(item.priceArs)}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
