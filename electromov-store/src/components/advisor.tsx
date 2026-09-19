"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, RotateCcw, Sparkles } from "lucide-react";
import type { Product, StoreSettings, Vehicle } from "@/lib/types";
import { formatArs, formatInstallments, usdToArs } from "@/lib/money";
import { useCart } from "@/components/cart-provider";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/site";

type Answers = {
  vehiculo: string;
  lugar: "cochera-propia" | "edificio" | "sin-lugar-fijo" | "";
  km: "poco" | "medio" | "mucho" | "";
  afuera: "si" | "no" | "";
};

const STEPS = [
  {
    key: "vehiculo" as const,
    title: "¿Qué vehículo cargás?",
    help: "Lo usamos para calcular la potencia que acepta y el tiempo de carga real.",
  },
  {
    key: "lugar" as const,
    title: "¿Dónde lo vas a cargar?",
    help: "Define si podés instalar un equipo fijo o necesitás algo portátil.",
    options: [
      { value: "cochera-propia", label: "Cochera o garage propio", hint: "Tengo acceso al tablero eléctrico" },
      { value: "edificio", label: "Cochera en edificio", hint: "Espacio compartido, con administración de por medio" },
      { value: "sin-lugar-fijo", label: "En la calle o sin lugar fijo", hint: "Cargo donde puedo, casi siempre afuera" },
    ],
  },
  {
    key: "km" as const,
    title: "¿Cuántos kilómetros hacés por día?",
    help: "Determina si necesitás carga rápida en casa o alcanza con cargar lento de noche.",
    options: [
      { value: "poco", label: "Menos de 30 km", hint: "Uso urbano liviano" },
      { value: "medio", label: "Entre 30 y 80 km", hint: "Ida y vuelta al trabajo todos los días" },
      { value: "mucho", label: "Más de 80 km", hint: "Uso intensivo, viajes o trabajo con el auto" },
    ],
  },
  {
    key: "afuera" as const,
    title: "¿Cargás también en cargadores públicos?",
    help: "Casi todos los puntos públicos del país son solo toma, sin cable.",
    options: [
      { value: "si", label: "Sí, o pienso hacerlo", hint: "Shoppings, hoteles, estaciones de servicio" },
      { value: "no", label: "No, solo en casa", hint: "Toda la carga es domiciliaria" },
    ],
  },
];

function recommend(answers: Answers, vehicles: Vehicle[]) {
  const vehicle = vehicles.find((v) => v.slug === answers.vehiculo);
  const reasons: string[] = [];
  let mainSlug = "wallbox-7kw-smart";

  if (answers.lugar === "sin-lugar-fijo") {
    mainSlug = "evse-portatil-35kw";
    reasons.push("Como no tenés un lugar fijo, necesitás un equipo que viaje con vos y funcione en cualquier toma de 220 V.");
  } else if (answers.lugar === "edificio" && answers.km !== "mucho") {
    mainSlug = "evse-portatil-35kw";
    reasons.push("En una cochera de edificio instalar un equipo fijo requiere aprobación del consorcio. El portátil te deja cargar desde ya, sin trámites.");
  } else if (answers.km === "poco") {
    mainSlug = "evse-portatil-35kw";
    reasons.push("Con menos de 30 km por día, cargar de noche a 3,5 kW te sobra: recuperás más de 150 km en 10 horas.");
  } else {
    reasons.push("Con tu uso diario, el Wallbox de 7,4 kW es la única opción que te garantiza salir al 100% todas las mañanas.");
  }

  if (vehicle) {
    if (mainSlug === "wallbox-7kw-smart") {
      reasons.push(
        `El ${vehicle.brand} ${vehicle.model} acepta hasta ${vehicle.maxAcKw} kW en corriente alterna, así que aprovecha el Wallbox de punta a punta.`,
      );
    } else {
      const horas = Math.round((vehicle.batteryKwh * 0.8) / (3.5 * 0.9));
      reasons.push(
        `Un ${vehicle.brand} ${vehicle.model} carga del 20 al 100% en unas ${horas} horas a 3,5 kW: entra cómodo en una noche.`,
      );
    }
  }

  if (answers.lugar === "cochera-propia" && mainSlug === "wallbox-7kw-smart") {
    reasons.push("Tenés acceso al tablero, así que la instalación es una línea dedicada: un electricista matriculado la hace en 2 o 3 horas.");
  }

  const extras: string[] = [];
  if (answers.afuera === "si") extras.push("cable-tipo-2-mode-3-32a");
  if (mainSlug === "wallbox-7kw-smart" && answers.km === "mucho") extras.push("evse-portatil-35kw");
  if (mainSlug === "evse-portatil-35kw") extras.push("adaptador-tipo-2-schuko");

  return { mainSlug, reasons, extras: Array.from(new Set(extras)) };
}

export function Advisor({
  products,
  vehicles,
  settings,
}: {
  products: Product[];
  vehicles: Vehicle[];
  settings: StoreSettings;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ vehiculo: "", lugar: "", km: "", afuera: "" });
  const { add } = useCart();

  const done = step >= STEPS.length;
  const result = useMemo(() => (done ? recommend(answers, vehicles) : null), [done, answers, vehicles]);
  const main = result ? products.find((p) => p.slug === result.mainSlug) : null;
  const extras = result ? products.filter((p) => result.extras.includes(p.slug)) : [];

  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    const next = step + 1;
    setStep(next);
    if (next >= STEPS.length) {
      track("generate_lead", { method: "asesor", ...answers, [key]: value });
    }
  };

  if (done && main) {
    const priceArs = usdToArs(main.priceUsd, settings.usdRate);
    return (
      <div className="animate-[fade-up_0.5s_ease-out_both]">
        <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-9">
          <p className="inline-flex items-center gap-2 rounded-full bg-volt-50 px-3.5 py-1.5 text-[13px] font-semibold text-volt-800">
            <Sparkles className="h-4 w-4" aria-hidden /> Tu recomendación
          </p>

          <div className="mt-6 grid gap-8 sm:grid-cols-[0.8fr_1.2fr]">
            <div className="relative aspect-square rounded-2xl bg-sand-50">
              <Image
                src={main.images[0]?.url ?? ""}
                alt={main.images[0]?.alt ?? main.name}
                fill
                sizes="(max-width: 640px) 80vw, 300px"
                className="object-contain p-6"
              />
            </div>

            <div>
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink-800">{main.name}</h2>
              <p className="mt-2 text-[15.5px] leading-relaxed text-sand-600">{main.tagline}</p>

              <ul className="mt-5 space-y-2.5">
                {result!.reasons.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-800">
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-volt-500" aria-hidden />
                    {r}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="text-[28px] font-semibold tracking-[-0.03em] text-ink-800">{formatArs(priceArs)}</p>
                <p className="text-[14px] font-medium text-volt-700">
                  {formatInstallments(priceArs, settings.maxInstallments)}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    add({
                      slug: main.slug,
                      id: main.id,
                      name: main.name,
                      priceArs,
                      image: main.images[0]?.url ?? "",
                      sku: main.sku,
                      category: main.categorySlug,
                    })
                  }
                  className="inline-flex h-12 items-center rounded-full bg-volt-500 px-6 text-[15px] font-semibold text-ink-900 hover:bg-volt-400"
                >
                  Agregar al carrito
                </button>
                <Link
                  href={`/productos/${main.slug}`}
                  className="inline-flex h-12 items-center rounded-full border border-ink-800 px-6 text-[15px] font-semibold text-ink-800 hover:bg-ink-800 hover:text-white"
                >
                  Ver ficha completa
                </Link>
              </div>
            </div>
          </div>
        </div>

        {extras.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-[18px] font-semibold tracking-tight text-ink-800">
              Con esto tu equipo queda completo
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {extras.map((p) => {
                const price = usdToArs(p.priceUsd, settings.usdRate);
                return (
                  <div key={p.id} className="flex gap-4 rounded-2xl border border-sand-200 bg-white p-4">
                    <div className="relative h-20 w-20 shrink-0 rounded-xl bg-sand-50">
                      <Image src={p.images[0]?.url ?? ""} alt="" fill sizes="80px" className="object-contain p-2" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/productos/${p.slug}`} className="text-[15.5px] font-semibold text-ink-800 hover:underline">
                        {p.name}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-sand-600">{p.shortDescription}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[15px] font-semibold text-ink-800">{formatArs(price)}</span>
                        <button
                          type="button"
                          onClick={() =>
                            add({
                              slug: p.slug,
                              id: p.id,
                              name: p.name,
                              priceArs: price,
                              image: p.images[0]?.url ?? "",
                              sku: p.sku,
                              category: p.categorySlug,
                            })
                          }
                          className="rounded-full border border-ink-800 px-3.5 py-1.5 text-[13px] font-semibold text-ink-800 hover:bg-ink-800 hover:text-white"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setAnswers({ vehiculo: "", lugar: "", km: "", afuera: "" });
            }}
            className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-sand-600 hover:text-ink-800"
          >
            <RotateCcw className="h-4 w-4" /> Volver a empezar
          </button>
          <a
            href={waLink(
              `Hola ElectroMov, usé el asesor y me recomendó el ${main.name}. Quiero confirmar si es lo correcto para mi caso.`,
            )}
            target="_blank"
            rel="noopener"
            className="inline-flex h-11 items-center rounded-full bg-[#25D366] px-5 text-[14.5px] font-semibold text-[#052e16]"
          >
            Validarlo con un técnico
          </a>
        </div>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-9">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-volt-500" : "bg-sand-200"}`}
          />
        ))}
      </div>
      <p className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-sand-400">
        Paso {step + 1} de {STEPS.length}
      </p>
      <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink-800 sm:text-[30px]">
        {current.title}
      </h2>
      <p className="mt-2 text-[15.5px] leading-relaxed text-sand-600">{current.help}</p>

      <div className="mt-7">
        {current.key === "vehiculo" ? (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {vehicles.map((v) => (
              <button
                key={v.slug}
                type="button"
                onClick={() => setAnswer("vehiculo", v.slug)}
                className="flex items-center justify-between rounded-xl border border-sand-200 px-4 py-3.5 text-left transition-colors hover:border-ink-800 hover:bg-sand-50"
              >
                <span>
                  <span className="block text-[15.5px] font-medium text-ink-800">
                    {v.brand} {v.model}
                  </span>
                  <span className="block text-[13px] text-sand-500">
                    {v.batteryKwh} kWh · acepta {v.maxAcKw} kW AC
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-sand-400" aria-hidden />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAnswer("vehiculo", "otro")}
              className="flex items-center justify-between rounded-xl border border-dashed border-sand-300 px-4 py-3.5 text-left transition-colors hover:border-ink-800"
            >
              <span className="text-[15.5px] font-medium text-ink-800">Otro vehículo / todavía no lo tengo</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-sand-400" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {current.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnswer(current.key, opt.value)}
                className="flex items-center justify-between rounded-xl border border-sand-200 px-5 py-4 text-left transition-colors hover:border-ink-800 hover:bg-sand-50"
              >
                <span>
                  <span className="block text-[16px] font-medium text-ink-800">{opt.label}</span>
                  <span className="block text-[13.5px] text-sand-500">{opt.hint}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-sand-400" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>

      {step > 0 ? (
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold text-sand-600 hover:text-ink-800"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
      ) : null}
    </div>
  );
}
