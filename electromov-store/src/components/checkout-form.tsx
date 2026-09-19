"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { AlertCircle, CheckCircle2, Loader2, Lock, Store, Truck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatArs, formatInstallments } from "@/lib/money";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/site";

type ShippingMethod = "pickup" | "andreani" | "correo";

type Result = {
  reference: string;
  totalArs: number;
  shippingArs: number;
  preferenceId?: string;
  initPoint?: string;
  mode: "mercadopago" | "manual";
  warning?: string;
};

const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => {
      bricks: () => {
        create: (
          brick: string,
          container: string,
          settings: Record<string, unknown>,
        ) => Promise<unknown>;
      };
    };
  }
}

export function CheckoutForm({
  shippingRates,
  freeShippingThreshold,
  maxInstallments,
  mpPublicKey,
  mpSandbox,
}: {
  shippingRates: Record<ShippingMethod, { label: string; price: number; eta: string }>;
  freeShippingThreshold: number;
  maxInstallments: number;
  mpPublicKey: string;
  mpSandbox: boolean;
}) {
  const { lines, subtotal, clear, ready } = useCart();
  const [method, setMethod] = useState<ShippingMethod>("andreani");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const brickMounted = useRef(false);

  const shippingCost = useMemo(
    () => (subtotal >= freeShippingThreshold ? 0 : shippingRates[method].price),
    [subtotal, freeShippingThreshold, shippingRates, method],
  );
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!result?.preferenceId || !sdkReady || !mpPublicKey || brickMounted.current) return;
    brickMounted.current = true;
    try {
      const mp = new window.MercadoPago!(mpPublicKey, { locale: "es-AR" });
      void mp.bricks().create("wallet", "mp-wallet-brick", {
        initialization: { preferenceId: result.preferenceId, redirectMode: "self" },
        customization: { texts: { valueProp: "smart_option" }, visual: { buttonBackground: "black", borderRadius: "999px" } },
      });
    } catch (e) {
      console.error("No se pudo montar el brick de Mercado Pago", e);
    }
  }, [result, sdkReady, mpPublicKey]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSending(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      customerEmail: String(form.get("customerEmail") ?? ""),
      customerPhone: String(form.get("customerPhone") ?? ""),
      customerDoc: String(form.get("customerDoc") ?? ""),
      shippingMethod: method,
      shippingAddress: String(form.get("shippingAddress") ?? ""),
      shippingCity: String(form.get("shippingCity") ?? ""),
      shippingZip: String(form.get("shippingZip") ?? ""),
      shippingProvince: String(form.get("shippingProvince") ?? ""),
      notes: String(form.get("notes") ?? ""),
      items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No pudimos procesar el pedido");

      setResult(data as Result);
      track("add_payment_info", {
        currency: "ARS",
        value: data.totalArs,
        items: lines.map((l) => ({ item_id: l.sku, item_name: l.name, price: l.priceArs, quantity: l.qty })),
      });
      if ((data as Result).mode === "manual") clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSending(false);
    }
  }

  if (ready && lines.length === 0 && !result) {
    return (
      <div className="rounded-2xl border border-sand-200 bg-white p-10 text-center">
        <p className="text-[17px] text-sand-600">Tu carrito está vacío.</p>
        <Link
          href="/productos"
          className="mt-5 inline-flex h-12 items-center rounded-full bg-ink-800 px-6 text-[15px] font-semibold text-white"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  if (result?.mode === "manual") {
    return (
      <div className="rounded-2xl border border-volt-200 bg-volt-50 p-8">
        <CheckCircle2 className="h-10 w-10 text-volt-600" aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-800">
          Pedido {result.reference} registrado
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-800/80">
          Total: <strong>{formatArs(result.totalArs)}</strong>. Te escribimos para coordinar el pago por transferencia
          o link de Mercado Pago y confirmar el envío. También podés adelantarlo vos por WhatsApp con el número de
          pedido.
        </p>
        {result.warning ? <p className="mt-3 text-[14px] text-amber-800">{result.warning}</p> : null}
        <a
          href={waLink(`Hola ElectroMov, hice el pedido ${result.reference} en la web. Quiero coordinar el pago.`)}
          target="_blank"
          rel="noopener"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-[#052e16]"
        >
          Coordinar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
      <form onSubmit={onSubmit} className="space-y-8">
        <fieldset className="rounded-2xl border border-sand-200 bg-white p-6">
          <legend className="px-2 text-[13px] font-bold uppercase tracking-wider text-volt-700">1 · Tus datos</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input name="customerName" label="Nombre y apellido" required autoComplete="name" />
            <Input name="customerEmail" label="Email" type="email" required autoComplete="email" />
            <Input name="customerPhone" label="Teléfono / WhatsApp" required autoComplete="tel" placeholder="11 5555 5555" />
            <Input name="customerDoc" label="DNI o CUIT (para la factura)" inputMode="numeric" />
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-sand-200 bg-white p-6">
          <legend className="px-2 text-[13px] font-bold uppercase tracking-wider text-volt-700">2 · Entrega</legend>
          <div className="mt-4 space-y-2.5">
            {(Object.keys(shippingRates) as ShippingMethod[]).map((key) => {
              const option = shippingRates[key];
              const free = subtotal >= freeShippingThreshold && key !== "pickup";
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    method === key ? "border-ink-800 bg-sand-50" : "border-sand-200 hover:border-sand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={key}
                    checked={method === key}
                    onChange={() => setMethod(key)}
                    className="mt-1 accent-[#0b1f17]"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[15.5px] font-medium text-ink-800">
                      {key === "pickup" ? <Store className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] text-sand-500">{option.eta}</span>
                  </span>
                  <span className="text-[15px] font-semibold text-ink-800">
                    {option.price === 0 || free ? "Gratis" : formatArs(option.price)}
                  </span>
                </label>
              );
            })}
          </div>

          {method !== "pickup" ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input name="shippingAddress" label="Dirección (calle, número, piso)" required autoComplete="street-address" />
              </div>
              <Input name="shippingCity" label="Localidad" required autoComplete="address-level2" />
              <Input name="shippingZip" label="Código postal" required inputMode="numeric" autoComplete="postal-code" />
              <label className="block sm:col-span-2">
                <span className="text-[13px] font-semibold text-ink-800">Provincia</span>
                <select
                  name="shippingProvince"
                  required
                  defaultValue="Buenos Aires"
                  className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
                >
                  {PROVINCES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-sand-50 p-4 text-[14px] leading-relaxed text-sand-600">
              Retirás en nuestro local de Berazategui, de lunes a sábado de 9 a 18 h. Te escribimos para coordinar el
              horario apenas se acredite el pago.
            </p>
          )}

          <label className="mt-5 block">
            <span className="text-[13px] font-semibold text-ink-800">Comentarios (opcional)</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Entre calles, horario de entrega, datos de facturación…"
              className="mt-1.5 w-full rounded-xl border border-sand-200 bg-white p-3 text-[15px] outline-none focus:border-ink-800"
            />
          </label>
        </fieldset>

        <fieldset className="rounded-2xl border border-sand-200 bg-white p-6">
          <legend className="px-2 text-[13px] font-bold uppercase tracking-wider text-volt-700">3 · Pago</legend>

          {result?.preferenceId ? (
            <div className="mt-4">
              <p className="text-[15px] leading-relaxed text-sand-600">
                Pedido <strong className="text-ink-800">{result.reference}</strong> listo. Pagá con tarjeta, dinero en
                cuenta o efectivo desde acá.
              </p>
              <Script
                src="https://sdk.mercadopago.com/js/v2"
                strategy="afterInteractive"
                onLoad={() => setSdkReady(true)}
              />
              <div id="mp-wallet-brick" className="mt-4" />
              {result.initPoint ? (
                <a
                  href={result.initPoint}
                  className="mt-3 inline-block text-[14px] font-semibold text-volt-700 underline underline-offset-4"
                >
                  Si no ves el botón, abrí el pago en Mercado Pago
                </a>
              ) : null}
              {mpSandbox ? (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-900">
                  Modo de prueba: estás usando credenciales TEST de Mercado Pago. Ningún pago es real.
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <p className="mt-4 text-[15px] leading-relaxed text-sand-600">
                Pagás con Mercado Pago: tarjeta de crédito en hasta {maxInstallments} cuotas sin interés, débito, dinero
                en cuenta o efectivo. También aceptamos transferencia bancaria.
              </p>

              {error ? (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3.5 text-[14px] text-red-800">
                  <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={sending || lines.length === 0}
                className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-volt-500 text-base font-semibold text-ink-900 transition-colors hover:bg-volt-400 disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Generando el pedido…
                  </>
                ) : (
                  <>
                    <Lock className="h-4.5 w-4.5" /> Confirmar y pagar {formatArs(total)}
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[12.5px] text-sand-500">
                Al confirmar aceptás los{" "}
                <Link href="/legales/terminos" className="underline underline-offset-2">
                  términos y condiciones
                </Link>
                . Tenés 10 días corridos de arrepentimiento por la Ley 24.240.
              </p>
            </>
          )}
        </fieldset>
      </form>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
          <h2 className="text-[17px] font-semibold tracking-tight text-ink-800">Tu pedido</h2>
          <ul className="mt-4 space-y-4">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-sand-200 bg-white">
                  <Image src={line.image} alt="" fill sizes="64px" className="object-contain p-1.5" />
                  <span className="absolute right-0 top-0 grid h-5 w-5 place-items-center rounded-bl-lg bg-ink-800 text-[11px] font-bold text-white">
                    {line.qty}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium leading-snug text-ink-800">{line.name}</span>
                  <span className="mt-0.5 block text-[13px] text-sand-500">{formatArs(line.priceArs)} c/u</span>
                </span>
                <span className="text-[14.5px] font-semibold text-ink-800">{formatArs(line.priceArs * line.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-[14.5px]">
            <div className="flex justify-between">
              <dt className="text-sand-600">Subtotal</dt>
              <dd className="font-medium text-ink-800">{formatArs(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sand-600">Envío</dt>
              <dd className="font-medium text-ink-800">{shippingCost === 0 ? "Gratis" : formatArs(shippingCost)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-sand-200 pt-4">
            <span className="text-[15px] font-semibold text-ink-800">Total</span>
            <span className="text-2xl font-semibold tracking-tight text-ink-800">{formatArs(total)}</span>
          </div>
          <p className="mt-1 text-right text-[13px] text-volt-700">{formatInstallments(total, maxInstallments)}</p>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-sand-500">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          El pago se procesa en los servidores de Mercado Pago. ElectroMov no almacena datos de tu tarjeta.
        </p>
      </aside>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-800">
        {label} {required ? <span className="text-volt-600">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
      />
    </label>
  );
}
