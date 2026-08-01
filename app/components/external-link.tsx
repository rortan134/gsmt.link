import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const ExternalLink = ({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) => (
    <Link
        className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
        draggable={false}
        href={href}
        rel="noreferrer"
        target="_blank"
    >
        {children}
        <ArrowUpRight className="mt-px inline-block size-3 opacity-80" />
        <span
            aria-hidden
            className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
        />
    </Link>
);

export { ExternalLink };
