import { withGTConfig } from "gt-next/config";
import type { NextConfig } from "next";

const config: NextConfig = {};

export default withGTConfig(config, {
    experimentalLocaleResolution: true,
    loadTranslationsPath: "./load-translations.ts",
});
