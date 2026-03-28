import { withGTConfig } from "gt-next/config";
import type { NextConfig } from "next";

const config: NextConfig = {
    cacheComponents: true,
};

export default withGTConfig(config, {
    experimentalLocaleResolution: true,
    loadTranslationsPath: "./translations.ts",
});
