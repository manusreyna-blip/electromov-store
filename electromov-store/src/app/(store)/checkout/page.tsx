import type { Metadata } from "next";
import { getSettings } from "@/lib/repo";
import { SHIPPING_RATES } from "@/lib/site";
import { CheckoutForm } from "@/components/checkout-form";
import { mpPublicKey, mpSandbox } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalizá tu compra en ElectroMov con Mercado Pago, hasta 12 cuotas sin interés.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-[32px] font-semibold tracking-[-0.035em] text-ink-800 sm:text-[38px]">Finalizá tu compra</h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-sand-600">
        Tres pasos y listo. Despachamos dentro de las 24 h hábiles de acreditado el pago.
      </p>

      <div className="mt-10">
        <CheckoutForm
          shippingRates={SHIPPING_RATES}
          freeShippingThreshold={settings.freeShippingThresholdArs}
          maxInstallments={settings.maxInstallments}
          mpPublicKey={mpPublicKey}
          mpSandbox={mpSandbox}
        />
      </div>
    </div>
  );
}
