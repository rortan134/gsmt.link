import { cn } from "@/app/lib/cn";
import type { Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import type * as React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

export const viewport: Viewport = {
    colorScheme: "light",
    initialScale: 1,
    minimumScale: 1,
    themeColor: "#ffffff",
    viewportFit: "cover",
    width: "device-width",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html dir="ltr" lang="en">
            <body
                className={cn("isolate pb-24", inter.className, serif.variable)}
                style={{ colorScheme: "light" }}
            >
                {children}
            </body>
        </html>
    );
}
