import type { AnalyticsConfig } from "./config";

export function getPlausibleScript(config: AnalyticsConfig): string {
  return `<script defer data-domain="${config.plausibleDomain}" src="${config.plausibleApiHost}/js/script.js"></script>`;
}

export function getGA4Script(config: AnalyticsConfig): string {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${config.ga4MeasurementId}');
</script>`;
}

export function getAnalyticsScript(config: AnalyticsConfig): string {
  if (config.provider === "plausible") return getPlausibleScript(config);
  return getGA4Script(config);
}
