import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";

import { SITE } from "@/lib/site";
import { JsonLd, organizationJsonLd, websiteJsonLd, abs } from "@/lib/seo";
import { listProducts, getSettings } from "@/lib/repo";
import { usdToArs } from "@/lib/money";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { Header, type SearchItem } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics, ConsentBanner } from "@/components/analytics";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { CATEGORIES } from "@/data/catalog";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Carga para autos eléctricos en Argentina`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "wallbox argentina",
    "cargador auto eléctrico",
    "cable tipo 2",
    "cargador portátil EV",
    "carga auto eléctrico en casa",
    "electromov",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.shortDescription,
    
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],

  },
  manifest: "/manifest.webmanifest",
  category: "shopping",
  other: {
    "geo.region": "AR-B",
    "geo.placename": "Berazategui, Buenos Aires",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f17" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [products, settings] = await Promise.all([listProducts(), getSettings()]);

  const searchItems: SearchItem[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: CATEGORIES.find((c) => c.slug === p.categorySlug)?.shortName ?? "Producto",
    priceArs: usdToArs(p.priceUsd, settings.usdRate),
    image: p.images[0]?.url ?? "",
    keywords: p.keywords,
  }));

  return (
    <html lang={SITE.lang} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://sdk.mercadopago.com" />
        <link rel="alternate" type="application/rss+xml" title="Catálogo ElectroMov" href={abs("/feed/google")} />
      </head>
      <body className="min-h-dvh bg-white antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>

        <CartProvider>
          <Header
            items={searchItems}
            announcement={settings.announcementEnabled ? settings.announcement : null}
          />
          <main id="contenido">{children}</main>
          <Footer />
          <CartDrawer
            freeShippingThreshold={settings.freeShippingThresholdArs}
            maxInstallments={settings.maxInstallments}
          />
          <WhatsAppFab />
        </CartProvider>

        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ConsentBanner />

        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
