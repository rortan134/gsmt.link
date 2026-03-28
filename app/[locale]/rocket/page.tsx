import { Scene } from "@/app/components/rocket-scene";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    description: "Real-time rocket with procedural fire shader",
    title: "Rocket",
};

export default function RocketPage() {
    return (
        <main className="fixed inset-0 z-10 bg-neutral-950">
            <Suspense>
                <Scene />
            </Suspense>
        </main>
    );
}
