"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { updateConsent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CONSENT_KEY = "electromov.consent.v1";

/**
 * Consent Mode v2 arranca en "denied" y se actualiza cuando el usuario acepta.
 * Es el modo que exige Google para seguir midiendo conversiones en la UE y el
 * que recomienda usar en todos lados para no perder modelado de datos.
 */
export function Analytics() {
  if (!GA_ID && !ADS_ID && !META_ID && !GTM_ID) return null;

  return (
    <>
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var c=localStorage.getItem('${CONSENT_KEY}');if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}`}
      </Script>

      {GTM_ID ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}

      {GA_ID || ADS_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-config" strategy="afterInteractive">
            {`gtag('js', new Date());
${GA_ID ? `gtag('config','${GA_ID}',{send_page_view:true,currency:'ARS',country:'AR'});` : ""}
${ADS_ID ? `gtag('config','${ADS_ID}',{allow_enhanced_conversions:true});` : ""}`}
          </Script>
        </>
      ) : null}

      {META_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_ID}');fbq('track','PageView');`}
        </Script>
      ) : null}

      <PageViewTracker />
    </>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function" || !GA_ID) return;
    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!GA_ID && !ADS_ID && !META_ID && !GTM_ID) return;
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      /* noop */
    }
  }, []);

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    } catch {
      /* noop */
    }
    updateConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-2xl border border-sand-200 bg-white p-4 shadow-[var(--shadow-lift)] sm:inset-x-6 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-[13.5px] leading-relaxed text-sand-600">
          Usamos cookies para entender cómo se navega el sitio y mostrarte publicidad relevante. Podés aceptarlas o
          seguir solo con las necesarias.{" "}
          <a href="/legales/privacidad" className="font-medium text-ink-800 underline underline-offset-2">
            Más info
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="h-10 rounded-full border border-sand-200 px-4 text-sm font-semibold text-ink-800 hover:bg-sand-50"
          >
            Solo necesarias
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="h-10 rounded-full bg-ink-800 px-5 text-sm font-semibold text-white hover:bg-ink-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
