"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Fuel, PiggyBank, Zap } from "lucide-react";
import { formatArs, usdToArs } from "@/lib/money";
import type { StoreSettings, Vehicle } from "@/lib/types";

function Field({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-800">{label}</span>
      <span className="mt-1.5 flex h-11 items-center rounded-xl border border-sand-200 bg-white px-3 focus-within:border-ink-800">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-[15px] text-ink-800 outline-none"
        />
        {suffix ? <span className="shrink-0 pl-2 text-[13px] text-sand-500">{suffix}</span> : null}
      </span>
    </label>
  );
}

export function SavingsCalculator({
  settings,
  vehicles,
  wallboxPriceUsd,
}: {
  settings: StoreSettings;
  vehicles: Vehicle[];
  wallboxPriceUsd: number;
}) {
  const [kmMes, setKmMes] = useState(1000);
  const [vehicleSlug, setVehicleSlug] = useState(vehicles[0]?.slug ?? "");
  const [precioNafta, setPrecioNafta] = useState(settings.fuelPriceArs);
  const [consumoNafta, setConsumoNafta] = useState(8);
  const [precioKwh, setPrecioKwh] = useState(settings.kwhPriceArs);

  const vehicle = vehicles.find((v) => v.slug === vehicleSlug) ?? vehicles[0];

  const r = useMemo(() => {
    const consumoEv = vehicle?.consumptionKwh100 ?? 16;
    // 10% de pérdidas de carga: se paga más kWh de los que entran a la batería.
    const costoEv = (kmMes / 100) * consumoEv * precioKwh * 1.1;
    const costoNafta = (kmMes / 100) * consumoNafta * precioNafta;
    const ahorroMes = costoNafta - costoEv;
    const ahorroAnio = ahorroMes * 12;
    const pct = costoNafta > 0 ? Math.round((1 - costoEv / costoNafta) * 100) : 0;
    const wallboxArs = usdToArs(wallboxPriceUsd, settings.usdRate);
    const mesesRepago = ahorroMes > 0 ? wallboxArs / ahorroMes : 0;
    const costoPorKmEv = kmMes > 0 ? costoEv / kmMes : 0;
    const costoPorKmNafta = kmMes > 0 ? costoNafta / kmMes : 0;
    return { costoEv, costoNafta, ahorroMes, ahorroAnio, pct, wallboxArs, mesesRepago, costoPorKmEv, costoPorKmNafta };
  }, [kmMes, vehicle, precioKwh, consumoNafta, precioNafta, wallboxPriceUsd, settings.usdRate]);

  const maxCosto = Math.max(r.costoEv, r.costoNafta) || 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-sand-200 bg-white p-6">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink-800">Tus números</h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-ink-800">Vehículo eléctrico</span>
            <select
              value={vehicleSlug}
              onChange={(e) => setVehicleSlug(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
            >
              {vehicles.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.brand} {v.model} · {v.consumptionKwh100} kWh/100 km
                </option>
              ))}
            </select>
          </label>
          <Field label="Kilómetros por mes" value={kmMes} onChange={setKmMes} suffix="km" step={100} />
          <Field label="Precio del kWh" value={precioKwh} onChange={setPrecioKwh} suffix="$/kWh" step={1} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio de la nafta" value={precioNafta} onChange={setPrecioNafta} suffix="$/L" step={10} />
            <Field label="Consumo del nafta" value={consumoNafta} onChange={setConsumoNafta} suffix="L/100" step={0.5} />
          </div>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-sand-500">
          Los valores vienen precargados con la tarifa y el precio de combustible de referencia. Cambialos por los
          tuyos para ver tu número real.
        </p>
      </div>

      <div>
        <div className="rounded-2xl bg-ink-800 p-6 sm:p-7">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-white/50">Ahorro estimado</p>
          <p className="mt-2 text-[44px] font-semibold leading-none tracking-[-0.04em] text-volt-300">
            {formatArs(r.ahorroMes)}
          </p>
          <p className="mt-2 text-[15px] text-white/70">
            por mes · {formatArs(r.ahorroAnio)} por año · {r.pct}% menos de costo
          </p>

          <div className="mt-7 space-y-4">
            <div>
              <div className="flex items-center justify-between text-[14px] text-white/80">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-volt-400" aria-hidden /> Cargando en casa
                </span>
                <span className="font-semibold text-white">{formatArs(r.costoEv)}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-volt-500" style={{ width: `${(r.costoEv / maxCosto) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[14px] text-white/80">
                <span className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-white/50" aria-hidden /> Con nafta
                </span>
                <span className="font-semibold text-white">{formatArs(r.costoNafta)}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white/30" style={{ width: `${(r.costoNafta / maxCosto) * 100}%` }} />
              </div>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-white">
            <div>
              <dt className="text-[12px] uppercase tracking-wide text-white/50">Costo por km eléctrico</dt>
              <dd className="mt-1 text-xl font-semibold text-volt-300">{formatArs(r.costoPorKmEv)}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wide text-white/50">Costo por km nafta</dt>
              <dd className="mt-1 text-xl font-semibold">{formatArs(r.costoPorKmNafta)}</dd>
            </div>
          </dl>
        </div>

        {r.ahorroMes > 0 ? (
          <div className="mt-5 rounded-2xl border border-volt-200 bg-volt-50 p-6">
            <p className="flex items-center gap-2 text-[15px] font-semibold text-volt-900">
              <PiggyBank className="h-5 w-5" aria-hidden /> El Wallbox se paga solo
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-volt-900/85">
              Con este ahorro, el Wallbox 7 kW Smart ({formatArs(r.wallboxArs)}) se repaga en{" "}
              <strong>{Math.max(1, Math.round(r.mesesRepago))} meses</strong>. Desde ahí en adelante, todo lo que no
              gastás en nafta te queda a vos.
            </p>
            <Link
              href="/productos/wallbox-7kw-smart"
              className="mt-4 inline-flex h-11 items-center rounded-full bg-ink-800 px-5 text-[14.5px] font-semibold text-white hover:bg-ink-700"
            >
              Ver el Wallbox 7 kW
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
