"use client";

import { cn } from "@/app/lib/cn";
import { motion } from "motion/react";
import type * as React from "react";

function getFactorFromProps(
    variant: string,
    className: string | undefined
): number {
    const s = `${variant}\0${className ?? ""}`;
    let h = 1;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(h, 131) + s.charCodeAt(i)) % 1_000_000_007;
    }
    const t = (h % 1_000_000) / 1_000_000;
    return 0.9 + t * 0.6;
}

const Line = ({
    variant = "horizontal",
    className,
    ...props
}: React.ComponentProps<typeof motion.div> & {
    variant?: "vertical" | "horizontal";
}) => {
    const duration = 1.2 * getFactorFromProps(variant, className);

    return (
        <motion.div
            {...props}
            animate={{
                opacity: 0,
                ...(variant === "vertical" ? { height: 0 } : { width: 0 }),
            }}
            aria-hidden
            className={cn(
                "pointer-events-none absolute origin-center select-none bg-muted-foreground opacity-40 mix-blend-soft-light",
                {
                    "overflow-fade-x -inset-x-11 h-px":
                        variant === "horizontal",
                    "overflow-fade-y -top-6 -bottom-8 w-px":
                        variant === "vertical",
                },
                className
            )}
            initial={{ opacity: 0.4 }}
            transition={{
                delay: 0.6,
                duration,
                ease: "easeInOut",
            }}
        />
    );
};

export { Line };
