"use client";

import {
    BlossomCarousel,
    BlossomDot,
    BlossomDots,
} from "@blossom-carousel/react";
import * as React from "react";
import { cn } from "@/app/lib/cn";

const Carousel = ({ children }: React.PropsWithChildren) => {
    const id = React.useId().replaceAll(":", "");
    const items = React.Children.toArray(children);

    return (
        <>
            <BlossomCarousel
                className="relative -mr-[max(2rem,50vw-16.75rem)] -ml-[max(2rem,50vw-16.75rem)] grid w-[calc(100%+max(4rem,100vw-33.5rem))] snap-x snap-mandatory scroll-pr-[max(2rem,50vw-16.75rem)] scroll-pl-[max(2rem,50vw-16.75rem)] auto-cols-[20rem] grid-flow-col gap-3 scroll-auto pr-[max(2rem,50vw-16.75rem)] pl-[max(2rem,50vw-16.75rem)]"
                id={id}
            >
                {items.map((child, index) =>
                    React.isValidElement<{ className?: string }>(child)
                        ? React.cloneElement(child, {
                              className: cn(
                                  "relative size-full max-w-xs snap-start overflow-hidden rounded-xl bg-card",
                                  index === items.length - 1 && "snap-end",
                                  child.props.className
                              ),
                              "data-blossom-slide": true,
                          } as React.HTMLAttributes<HTMLElement>)
                        : child
                )}
            </BlossomCarousel>
            <BlossomDots
                className="justify-start! flex items-center gap-1.5! pt-4"
                for={id}
            >
                {({ index, active }) => (
                    <BlossomDot
                        aria-current={active}
                        aria-label={`Slide ${index + 1}`}
                        className={cn(
                            "flex size-7 cursor-pointer select-none items-center justify-center rounded-lg bg-card! font-medium! text-muted-foreground! text-xs! transition-[padding]",
                            active && "bg-red-500! px-2! text-white!"
                        )}
                    >
                        {index + 1}
                    </BlossomDot>
                )}
            </BlossomDots>
        </>
    );
};

export { Carousel };
