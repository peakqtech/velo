export interface I18nConfig {
  defaultLocale: string;
  locales: readonly string[];
}

export function isValidLocale(config: I18nConfig, locale: string): boolean {
  return config.locales.includes(locale);
}

export function createContentLoader<T>(
  config: I18nConfig,
  importFn: (locale: string) => Promise<T>
): (locale: string) => Promise<T> {
  return async function getContent(locale: string): Promise<T> {
    const resolved = isValidLocale(config, locale) ? locale : config.defaultLocale;
    return importFn(resolved);
  };
}
