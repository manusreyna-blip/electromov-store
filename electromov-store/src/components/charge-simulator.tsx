"use client";

import { useMemo, useState } from "react";
import { BatteryCharging, Clock, Zap } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { formatArs } from "@/lib/money";

const POWERS = [
  { kw: 3.5, label: "Enchufe 220 V / EVSE portátil" },
  { kw: 7.4, label: "Wallbox 7 kW" },
  { kw: 11, label: "Wallbox 11 kW trifásico" },
];

export function ChargeSimulator({
  vehicles,
  kwhPriceArs,
  fixedPowerKw,
}: {
  vehicles: Vehicle[];
  kwhPriceArs: number;
  fixedPowerKw?: number;
}) {
  const [vehicleSlug, setVehicleSlug] = useState(vehicles[0]?.slug ?? "");
  const [from, setFrom] = useState(20);
  const [to, setTo] = useState(100);
  const [powerKw, setPowerKw] = useState(fixedPowerKw ?? 7.4);

  const vehicle = vehicles.find((v) => v.slug === vehicleSlug) ?? vehicles[0];

  const result = useMemo(() => {
    if (!vehicle) return null;
    const effectivePower = Math.min(powerKw, vehicle.maxAcKw);
    const kwh = (vehicle.batteryKwh * Math.max(0, to - from)) / 100;
    // 10% de pérdidas de carga AC, que es lo que se pierde en la práctica.
    const hours = kwh / (effectivePower * 0.9);
    const cost = kwh * kwhPriceArs;
    const km = (kwh / vehicle.consumptionKwh100) * 100;
    return { effectivePower, kwh, hours, cost, km, limited: powerKw > vehicle.maxAcKw };
  }, [vehicle, from, to, powerKw, kwhPriceArs]);

  if (!vehicle || !result) return null;

  const h = Math.floor(result.hours);
  const m = Math.round((result.hours - h) * 60);

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 sm:p-7">
      <h3 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink-800">
        <BatteryCharging className="h-5 w-5 text-volt-600" aria-hidden />
        Simulador de tiempo de carga
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-sand-600">
        Calculá cuánto tarda y cuánto cuesta cargar tu auto con este equipo, con la tarifa eléctrica actual.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-semibold text-ink-800">Tu vehículo</span>
          <select
            value={vehicleSlug}
            onChange={(e) => setVehicleSlug(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
          >
            {vehicles.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.brand} {v.model} · {v.batteryKwh} kWh
              </option>
            ))}
          </select>
        </label>

        {fixedPowerKw ? (
          <div>
            <span className="text-[13px] font-semibold text-ink-800">Equipo</span>
            <p className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-sand-200 bg-sand-50 px-3 text-[15px] text-ink-800">
              <Zap className="h-4 w-4 text-volt-600" aria-hidden /> {fixedPowerKw} kW
            </p>
          </div>
        ) : (
          <label className="block">
            <span className="text-[13px] font-semibold text-ink-800">Equipo de carga</span>
            <select
              value={powerKw}
              onChange={(e) => setPowerKw(Number(e.target.value))}
              className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
            >
              {POWERS.map((p) => (
                <option key={p.kw} value={p.kw}>
                  {p.label} ({p.kw} kW)
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between text-[13px] font-semibold text-ink-800">
            Batería actual <span className="text-volt-700">{from}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={95}
            step={5}
            value={from}
            onChange={(e) => setFrom(Math.min(Number(e.target.value), to - 5))}
            className="mt-2 w-full accent-[#00c776]"
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between text-[13px] font-semibold text-ink-800">
            Quiero llegar a <span className="text-volt-700">{to}%</span>
          </span>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={to}
            onChange={(e) => setTo(Math.max(Number(e.target.value), from + 5))}
            className="mt-2 w-full accent-[#00c776]"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-ink-800 p-5 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/50">
            <Clock className="h-3.5 w-3.5" aria-hidden /> Tiempo
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-volt-300">
            {h} h {m.toString().padStart(2, "0")} min
          </p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-white/50">Costo de la carga</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{formatArs(result.cost)}</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-white/50">Autonomía sumada</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{Math.round(result.km)} km</p>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-sand-500">
        {result.limited
          ? `El ${vehicle.brand} ${vehicle.model} acepta hasta ${vehicle.maxAcKw} kW en corriente alterna, así que el cálculo usa ese tope aunque el equipo entregue más.`
          : `Cálculo sobre ${result.kwh.toFixed(1)} kWh a ${result.effectivePower} kW, con 10% de pérdidas de carga y una tarifa de ${formatArs(kwhPriceArs)} por kWh.`}
      </p>
    </div>
  );
}
