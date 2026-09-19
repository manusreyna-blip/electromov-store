export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: "wallbox" | "cable" | "adapter" | "portable" | "moto" | "all";
};

export type Spec = { label: string; value: string };
export type Feature = { emoji: string; label: string; value: string };
export type Faq = { q: string; a: string };
export type ProductImage = { url: string; alt: string };

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  /** Título SEO, máx ~70 caracteres */
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  brand: string;
  categorySlug: string;
  status: "published" | "draft";
  featured: boolean;
  /** Precio base en USD. El sitio muestra ARS al tipo de cambio configurado. */
  priceUsd: number;
  /** Precio tachado (USD) para mostrar descuento. 0 = sin descuento. */
  compareAtUsd: number;
  /** Precio confirmado por el negocio. false = a revisar en el panel. */
  priceConfirmed: boolean;
  stock: number;
  shortDescription: string;
  longDescription: string[];
  highlights: string[];
  features: Feature[];
  specs: Spec[];
  faqs: Faq[];
  images: ProductImage[];
  badges: string[];
  /** Conectores/compatibilidad para el chequeo por vehículo */
  connectors: string[];
  powerKw: number;
  amps: number;
  phases: 1 | 3;
  warrantyMonths: number;
  weightKg: number;
  requiresElectrician: boolean;
  gtin?: string;
  mpn: string;
  keywords: string[];
  /** Slugs de productos que se ofrecen como complemento */
  crossSell: string[];
};

export type Vehicle = {
  slug: string;
  brand: string;
  model: string;
  batteryKwh: number;
  maxAcKw: number;
  connector: string;
  type: "BEV" | "PHEV";
  /** Consumo real promedio kWh/100 km */
  consumptionKwh100: number;
  recommended: string;
  alsoWorks: string[];
};

export type StoreSettings = {
  usdRate: number;
  usdRateUpdatedAt: string;
  ivaIncluded: boolean;
  maxInstallments: number;
  freeShippingThresholdArs: number;
  kwhPriceArs: number;
  fuelPriceArs: number;
  whatsapp: string;
  announcement: string;
  announcementEnabled: boolean;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  qty: number;
  unitPriceArs: number;
};

export type Order = {
  id: string;
  reference: string;
  createdAt: string;
  status: "pending" | "paid" | "rejected" | "cancelled" | "shipped" | "delivered";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDoc: string;
  shippingMethod: "pickup" | "andreani" | "correo";
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingProvince: string;
  notes: string;
  items: OrderItem[];
  subtotalArs: number;
  shippingArs: number;
  totalArs: number;
  usdRate: number;
  mpPreferenceId: string;
  mpPaymentId: string;
  paymentMethod: string;
  installments: number;
};
