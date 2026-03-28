/**
 * Load translations from local files (public/_gt/[locale].json).
 * Required for production: gt-next defaults to GT CDN; without this,
 * pre-generated translations in public/_gt/ are never used.
 *
 * @see https://generaltranslation.com/docs/next/guides/local-tx
 */
export default async function loadTranslations(
    locale: string
): Promise<Record<string, unknown>> {
    if (locale === "en") {
        return {};
    }
    try {
        const translations = await import(`./public/_gt/${locale}.json`);
        return translations.default as Record<string, unknown>;
    } catch (_) {
        return {} as Record<string, unknown>;
    }
}
