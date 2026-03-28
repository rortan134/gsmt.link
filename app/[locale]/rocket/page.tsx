import { Scene } from "@/app/components/rocket-scene";
import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Real-time rocket with procedural fire shader",
    title: "Rocket",
};

export default function RocketPage() {
    return (
        <main className="fixed inset-0 z-10 bg-neutral-950">
            <Scene />
        </main>
    );
}
