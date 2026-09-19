import { SITE } from "@/lib/site";
import { usdToArs } from "@/lib/money";
import type { Product, StoreSettings, Faq } from "@/lib/types";

export function abs(path = "/") {
  return new URL(path, SITE.url).toString();
}

/** Organización + negocio local. Va en el layout raíz. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "@id": abs("/#organization"),
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: abs("/logo.svg"),
    image: abs("/opengraph-image"),
    description: SITE.description,
    foundingDate: SITE.founded,
    telephone: `+${SITE.whatsapp}`,
    email: SITE.email,
    currenciesAccepted: "ARS",
    paymentAccepted: "Mercado Pago, Tarjeta de crédito, Tarjeta de débito, Transferencia bancaria, Efectivo",
    priceRange: "$$",
    areaServed: { "@type": "Country", name: "Argentina" },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [SITE.social.instagram, SITE.social.tiktok, SITE.social.youtube],
    knowsAbout: [
      "Carga de vehículos eléctricos",
      "Wallbox",
      "Conector Tipo 2 IEC 62196",
      "EVSE portátil",
      "Movilidad eléctrica en Argentina",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: SITE.url,
    name: SITE.name,
    inLanguage: SITE.lang,
    publisher: { "@id": abs("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: abs("/buscar?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product, settings: StoreSettings) {
  const priceArs = usdToArs(product.priceUsd, settings.usdRate);
  const validUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs(`/productos/${product.slug}#product`),
    name: product.name,
    sku: product.sku,
    mpn: product.mpn,
    ...(product.gtin ? { gtin13: product.gtin } : {}),
    description: product.seoDescription || product.shortDescription,
    image: product.images.map((i) => abs(i.url)),
    brand: { "@type": "Brand", name: product.brand },
    category: product.categorySlug,
    url: abs(`/productos/${product.slug}`),
    additionalProperty: product.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
    offers: {
      "@type": "Offer",
      "@id": abs(`/productos/${product.slug}#offer`),
      url: abs(`/productos/${product.slug}`),
      priceCurrency: "ARS",
      price: priceArs,
      priceValidUntil: validUntil,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": abs("/#organization") },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: priceArs >= settings.freeShippingThresholdArs ? 0 : 12900,
          currency: "ARS",
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "AR" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 7, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "AR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 10,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    hasEnergyConsumptionDetails: undefined,
    warranty: {
      "@type": "WarrantyPromise",
      durationOfWarranty: { "@type": "QuantitativeValue", value: product.warrantyMonths, unitCode: "MON" },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListJsonLd(products: Product[], settings: StoreSettings, listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/productos/${p.slug}`),
      name: p.name,
      item: {
        "@type": "Product",
        name: p.name,
        url: abs(`/productos/${p.slug}`),
        image: abs(p.images[0]?.url ?? "/opengraph-image"),
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: usdToArs(p.priceUsd, settings.usdRate),
          availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  };
}

export function howToJsonLd(name: string, description: string, steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime: "PT3H",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es generado por nosotros, no por el usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
