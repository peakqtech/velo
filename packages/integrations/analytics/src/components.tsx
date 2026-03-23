"use client";

import Script from "next/script";

interface AnalyticsScriptProps {
  provider: "plausible" | "ga4";
  plausibleDomain?: string;
  plausibleApiHost?: string;
  ga4MeasurementId?: string;
}

export function AnalyticsScript({ provider, plausibleDomain, plausibleApiHost = "https://plausible.io", ga4MeasurementId }: AnalyticsScriptProps) {
  if (provider === "plausible" && plausibleDomain) {
    return <Script defer data-domain={plausibleDomain} src={`${plausibleApiHost}/js/script.js`} />;
  }

  if (provider === "ga4" && ga4MeasurementId) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4MeasurementId}');
        `}</Script>
      </>
    );
  }

  return null;
}
