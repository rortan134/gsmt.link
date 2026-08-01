import { withGTConfig } from "gt-next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        useTypeScriptCli: true,
    },
};

export default withGTConfig(nextConfig, {
    getLocalePath: "./get-locale.ts",
    getRegionPath: "./get-region.ts",
    loadTranslationsPath: "./load-translations.ts",
});
