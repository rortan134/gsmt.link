import { GTProvider } from "gt-next";
import type { Metadata } from "next";
import type * as React from "react";

const WEBSITE_URL = "https://gsmt.link";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
    appleWebApp: { capable: true, statusBarStyle: "default" },
    category: "technology",
    description: "",
    formatDetection: { address: false, telephone: false },
    metadataBase: new URL(WEBSITE_URL),
    other: {
        "applicable-device": "pc,mobile",
        "msapplication-starturl": "/",
        "msapplication-TileColor": "#000000",
    },
    referrer: "origin",
    robots: { noimageindex: true },
    title: { default: "@gsmt", template: "%s | @gsmt" },
};

function LocaleLayout({ children }: React.PropsWithChildren) {
    return <GTProvider>{children}</GTProvider>;
}

export default LocaleLayout;
