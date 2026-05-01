import { GTProvider } from "gt-next";
import type { Metadata } from "next";
import type * as React from "react";
import { Suspense } from "react";

const WEBSITE_URL = "https://gsmt.link";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
    appleWebApp: { capable: true, statusBarStyle: "default" },
    category: "technology",
    description: "",
    formatDetection: { address: false, telephone: false },
    metadataBase: new URL(WEBSITE_URL),
    openGraph: {
        description: "",
        locale: "en_US",
        siteName: "gsmt",
        title: "Gilberto — Full-stack product developer",
        type: "website",
        url: "/",
    },
    other: {
        "applicable-device": "pc,mobile",
        "msapplication-starturl": "/",
        "msapplication-TileColor": "#000000",
    },
    referrer: "origin",
    robots: { noimageindex: true },
    title: {
        default: "Gilberto — Full-stack product developer",
        template: "%s | @gsmt",
    },
    twitter: {
        card: "summary",
        creator: "@gsmmtt",
        description: "",
        title: "Gilberto — Full-stack product developer",
    },
};

function LocaleLayout({ children }: React.PropsWithChildren) {
    return (
        <Suspense fallback={null}>
            <GTProvider>{children}</GTProvider>
        </Suspense>
    );
}

export default LocaleLayout;
