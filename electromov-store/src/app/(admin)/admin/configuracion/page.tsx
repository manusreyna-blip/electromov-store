import { redirect } from "next/navigation";
import { CheckCircle2, Database, XCircle } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { demoMode, getSettings } from "@/lib/repo";
import { saveSettingsAction, seedAction } from "@/app/(admin)/admin/actions";
import { mpEnabled, mpSandbox } from "@/lib/mercadopago";
import { formatArs } from "@/lib/money";

export const dynamic = "force-dynamic";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  hint?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-800">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 bg-white px-3 text-[15px] outline-none focus:border-ink-800"
      />
      {hint ? <span className="mt-1 block text-[12.5px] text-sand-500">{hint}</span> : null}
    </label>
  );
}

function Status({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 py-3">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
      )}
      <span>
        <span className="block text-[14.5px] font-medium text-ink-800">{label}</span>
        <span className="block text-[13.5px] leading-relaxed text-sand-600">{detail}</span>
      </span>
    </li>
  );
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; seeded?: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { ok, seeded } = await searchParams;
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink-800">Configuración</h1>
      <p className="mt-1.5 text-[15px] text-sand-600">
        Lo que cambies acá se aplica a toda la tienda: precios, cuotas, envío gratis y las calculadoras.
      </p>

      {ok ? (
        <p className="mt-5 rounded-xl border border-volt-200 bg-volt-50 p-3.5 text-[14px] text-volt-900">
          Configuración guardada y publicada.
        </p>
      ) : null}
      {seeded ? (
        <p className="mt-5 rounded-xl border border-volt-200 bg-volt-50 p-3.5 text-[14px] text-volt-900">
          Se cargaron {seeded} productos en la base de datos.
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <form action={saveSettingsAction} className="space-y-6">
          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Precios y moneda</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Tipo de cambio (ARS por USD)"
                name="usdRate"
                type="number"
                step="0.01"
                defaultValue={settings.usdRate}
                hint={`Actualizado el ${settings.usdRateUpdatedAt}. Todos los precios en pesos se recalculan al guardar.`}
              />
              <Field label="Cuotas sin interés" name="maxInstallments" type="number" defaultValue={settings.maxInstallments} />
              <Field
                label="Envío gratis desde (ARS)"
                name="freeShippingThresholdArs"
                type="number"
                defaultValue={settings.freeShippingThresholdArs}
                hint={`Hoy: ${formatArs(settings.freeShippingThresholdArs)}`}
              />
              <Field label="WhatsApp (solo números)" name="whatsapp" defaultValue={settings.whatsapp} hint="Formato: 5491135330569" />
            </div>
          </section>

          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Calculadoras</h2>
            <p className="mt-1.5 text-[13.5px] text-sand-600">
              Estos valores alimentan la calculadora de ahorro y el simulador de tiempo de carga.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Precio del kWh (ARS)" name="kwhPriceArs" type="number" step="0.01" defaultValue={settings.kwhPriceArs} />
              <Field label="Precio de la nafta (ARS/litro)" name="fuelPriceArs" type="number" step="0.01" defaultValue={settings.fuelPriceArs} />
            </div>
          </section>

          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Barra de anuncios</h2>
            <div className="mt-4 space-y-4">
              <Field label="Texto" name="announcement" defaultValue={settings.announcement} />
              <label className="flex items-center gap-2.5 text-[14px] text-ink-800">
                <input
                  type="checkbox"
                  name="announcementEnabled"
                  defaultChecked={settings.announcementEnabled}
                  className="h-4 w-4 accent-[#0b1f17]"
                />
                Mostrar la barra arriba de la tienda
              </label>
            </div>
          </section>

          <button
            type="submit"
            className="h-12 rounded-full bg-volt-500 px-8 text-[15px] font-semibold text-ink-900 hover:bg-volt-400"
          >
            Guardar configuración
          </button>
        </form>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-sand-200 bg-white p-6">
            <h2 className="text-[16px] font-semibold text-ink-800">Estado de la tienda</h2>
            <ul className="mt-3 divide-y divide-sand-100">
              <Status
                ok={!demoMode}
                label="Base de datos"
                detail={
                  demoMode
                    ? "No conectada. Agregá la variable DATABASE_URL en Vercel para guardar los cambios de forma permanente."
                    : "Conectada. Productos, pedidos y configuración se guardan en Postgres."
                }
              />
              <Status
                ok={mpEnabled && !mpSandbox}
                label="Mercado Pago"
                detail={
                  !mpEnabled
                    ? "Sin credenciales. Los pedidos se registran y se coordinan por WhatsApp o transferencia."
                    : mpSandbox
                      ? "Credenciales de prueba (TEST). Los pagos no son reales."
                      : "Activo en producción. Los pagos se cobran online."
                }
              />
              <Status
                ok={Boolean(process.env.NEXT_PUBLIC_GA_ID)}
                label="Google Analytics 4"
                detail={
                  process.env.NEXT_PUBLIC_GA_ID
                    ? `Midiendo con ${process.env.NEXT_PUBLIC_GA_ID}.`
                    : "Sin configurar. Agregá NEXT_PUBLIC_GA_ID para medir visitas y conversiones."
                }
              />
              <Status
                ok={Boolean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID)}
                label="Google Ads"
                detail={
                  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
                    ? "Conversiones de compra activas."
                    : "Sin configurar. Necesario para medir el retorno de las campañas."
                }
              />
            </ul>
          </section>

          {!demoMode ? (
            <section className="rounded-2xl border border-sand-200 bg-white p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-semibold text-ink-800">
                <Database className="h-4.5 w-4.5 text-volt-600" aria-hidden /> Cargar catálogo inicial
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-sand-600">
                Copia los productos de fábrica a la base de datos. Usalo una sola vez, al conectar la base por primera
                vez: vuelve a escribir los productos con el contenido original.
              </p>
              <form action={seedAction} className="mt-4">
                <button
                  type="submit"
                  className="h-11 w-full rounded-full border border-ink-800 text-[14.5px] font-semibold text-ink-800 hover:bg-ink-800 hover:text-white"
                >
                  Cargar catálogo inicial
                </button>
              </form>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
