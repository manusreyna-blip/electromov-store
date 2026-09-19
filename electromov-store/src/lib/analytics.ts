/**
 * Capa única de medición: GA4 + Google Ads + Meta Pixel.
 * Todos los eventos usan el esquema de e-commerce de GA4, que es el que
 * entienden Google Ads (conversiones mejoradas) y Looker Studio sin tocar nada.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_brand?: string;
};

export type TrackPayload = {
  currency?: string;
  value?: number;
  items?: EcommerceItem[];
  transaction_id?: string;
  shipping?: number;
  [key: string]: unknown;
};

const META_MAP: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  search: "Search",
  generate_lead: "Lead",
};

export function track(event: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ecommerce: payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  const metaEvent = META_MAP[event];
  if (metaEvent && typeof window.fbq === "function") {
    window.fbq("track", metaEvent, {
      currency: payload.currency ?? "ARS",
      value: payload.value ?? 0,
      content_ids: payload.items?.map((i) => i.item_id),
      content_type: "product",
    });
  }
}

/** Conversión de Google Ads con valor. Se dispara solo en la página de éxito. */
export function trackAdsConversion(value: number, transactionId: string) {
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!label || !id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: `${id}/${label}`,
    value,
    currency: "ARS",
    transaction_id: transactionId,
  });
}

/** Consent Mode v2: por defecto denegado, se actualiza cuando el usuario acepta. */
export function updateConsent(granted: boolean) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const state = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}
