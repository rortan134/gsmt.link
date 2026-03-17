import { CopyToClipboard } from "@/app/components/copy-to-clipboard";
import { Header } from "@/app/components/header";
import { S2 } from "@/app/components/icons";
import { Line } from "@/app/components/line";
import { LiveCount } from "@/app/components/live-count";
import { PageShell } from "@/app/components/page-shell";
import { Projects } from "@/app/components/projects";
import { Signature } from "@/app/components/signature";
import { Timezone } from "@/app/components/timezone";
import { cn } from "@/app/lib/cn";
import { dayjs } from "@/app/lib/dayjs";
import { formatCompactNumber } from "@/app/lib/format";
import { getPageViewCount, UpdateServerViewCounter } from "@/app/lib/views";
import { Link } from "@/i18n/routing";
import { TextHighlighter } from "@components/text-highlighter";
import {
    ArrowUpRight,
    Braces,
    Check,
    Clipboard,
    Eye,
    Github,
    Globe,
    Mail,
    TicketsPlane,
    Twitter,
    Watch,
} from "lucide-react";
import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
    title: "Gilbert",
};

async function PageViewsCounter() {
    const pageViewCount = await getPageViewCount();

    return (
        <span
            className={cn(
                "relative inline-flex items-center whitespace-nowrap font-serif text-muted-foreground text-xs tabular-nums",
                "after:pointer-events-none after:absolute after:-top-8 after:left-1/2 after:z-10 after:-translate-x-1/2 after:whitespace-nowrap after:rounded-md after:border after:border-border after:bg-background after:px-2.5 after:py-1 after:font-medium after:text-[11px] after:text-foreground after:opacity-0 after:shadow-sm after:transition-opacity after:duration-150 after:content-[attr(data-full-count)] hover:after:opacity-100 focus-visible:after:opacity-100"
            )}
            data-full-count={pageViewCount.toString()}
        >
            <Eye aria-hidden className="mr-1 size-4" focusable="false" />
            <span className="sr-only">Page Views</span>
            {formatCompactNumber(pageViewCount)} page views
        </span>
    );
}

function PageViewsCounterFallback() {
    return (
        <span
            className={cn(
                "inline-flex items-center whitespace-nowrap font-serif text-muted-foreground text-xs tabular-nums"
            )}
        >
            <Eye aria-hidden className="mr-1 size-4" focusable="false" />
            <span className="sr-only">Page Views</span>
            <span className="relative">
                00.0k
                <span className="absolute inset-0 z-10 animate-pulse rounded-md bg-gray-100" />
            </span>
            &nbsp;page views
        </span>
    );
}

export default function HomePage() {
    return (
        <PageShell>
            <Header />
            <section className="container relative mt-18 flex w-full items-center justify-between">
                <Line className="-top-20 left-5" variant="vertical" />
                <Line className="-top-20 right-6" variant="vertical" />
                <Line className="-top-20 right-14" variant="vertical" />
                <Line className="-top-16" />
                <Line className="-top-8" />
                <Line className="-top-1.5" />
                <Line className="top-8 w-11/12" />
                <div className="flex flex-col gap-y-3">
                    <h1 className="whitespace-nowrap font-medium font-serif text-foreground text-sm">
                        Gilbert
                    </h1>
                    <span className="whitespace-pre-wrap font-serif text-foreground text-xs">
                        <span className="mr-0.5 opacity-60">IPA</span>&nbsp;
                        <i className="mr-0.5">/ˈɡɪlbət/</i> —&nbsp;software
                        developer, <span className="opacity-60">maker.</span>
                    </span>
                    <Line className="-top-20 -right-4" variant="vertical" />
                </div>
                <div className="relative flex items-end justify-end gap-3 md:gap-4">
                    <Line className="-top-20 -left-2" variant="vertical" />
                    <React.Suspense fallback={<PageViewsCounterFallback />}>
                        <PageViewsCounter />
                    </React.Suspense>
                    <LiveCount />
                </div>
                <Line className="-bottom-1.5" />
            </section>
            <section className="container mt-4.5">
                <div className="group flex flex-col items-center gap-3 md:flex-row">
                    <div className="relative flex h-fit w-full items-center md:w-fit">
                        <Link
                            className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent pr-11 pl-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                            href="mailto:gsmt.dev@gmail.com"
                            title="Email"
                        >
                            <Mail
                                aria-hidden
                                className="mr-3 size-4"
                                focusable="false"
                            />
                            <span className="sr-only">Email</span>
                            gsmt.dev@gmail.com
                        </Link>
                        <CopyToClipboard text="gsmt.dev@gmail.com">
                            <button
                                aria-label="Copy email"
                                className="group/btn absolute right-2 z-10 inline-flex size-5 items-center justify-center rounded-[40%] bg-card p-3 hover:opacity-100 active:opacity-50 group-hover:opacity-75"
                                title="Copy"
                                type="button"
                            >
                                <Clipboard className="size-4 transition-all group-data-[copied=true]/btn:opacity-0" />
                                <Check className="absolute size-4 transition-all group-data-[copied=false]/btn:opacity-0" />
                                <span className="sr-only">Copy email</span>
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Link
                        className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent px-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                        href="https://twitter.com/gsmmtt"
                        rel="noreferrer noopener"
                        target="_blank"
                        title="Twitter"
                    >
                        <Twitter
                            aria-hidden
                            className="mr-3 size-4"
                            focusable="false"
                        />
                        <span className="sr-only">X (formerly Twitter)</span>
                        Twitter
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                    </Link>
                    <Link
                        className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent px-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                        href="https://github.com/rortan134"
                        rel="noreferrer noopener"
                        target="_blank"
                        title="GitHub"
                    >
                        <Github
                            aria-hidden
                            className="mr-3 size-4"
                            focusable="false"
                        />
                        <span className="sr-only">GitHub</span>
                        GitHub
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                    </Link>
                </div>
            </section>
            <section className="container mt-16 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="flex-1 truncate font-semibold text-muted-foreground text-xs">
                        Today
                        <span className="ml-3 inline-block font-serif opacity-50">
                            {dayjs().format("MMMM DD")}
                        </span>
                    </h1>
                    <div className="flex items-center justify-end space-x-3">
                        <S2 />
                    </div>
                </div>
                <p className="text-foreground text-sm">
                    Developer at heart, passionate about building a better web,{" "}
                    <TextHighlighter highlightColor="#FEFE6B">
                        creating great experiences
                    </TextHighlighter>{" "}
                    for end users, and trying to solve real-world{" "}
                    <Globe
                        aria-hidden
                        className="inline-block size-4 opacity-50"
                        focusable="false"
                    />{" "}
                    problems with{" "}
                    <TextHighlighter delay={2} highlightColor="#FEFE6B">
                        an eye for design
                    </TextHighlighter>
                    . I&apos;m also a fan of open-source software, and cool
                    looking watches{" "}
                    <Watch
                        aria-hidden
                        className="inline-block size-4 opacity-50"
                        focusable="false"
                    />
                    .
                    <br />
                    <br />
                    Introduced to technology at a young age, I have been{" "}
                    <TextHighlighter delay={3} highlightColor="#FEFE6B">
                        building software for over 3 years
                    </TextHighlighter>{" "}
                    now. Playing with prototypes and doing everything from data
                    scrapers{" "}
                    <Braces
                        aria-hidden
                        className="inline-block size-4 opacity-50"
                        focusable="false"
                    />
                    , dynamic websites and APIs, charmful native applications,
                    fractal simulations, data visualizations, engaging in-app
                    experiences and more. Outside of programming, I enjoy doing
                    photography and traveling{" "}
                    <TicketsPlane
                        aria-hidden
                        className="inline-block size-4 opacity-50"
                        focusable="false"
                    />
                    .
                </p>
                <hr className="my-2 border-border" />
                <h1 className="mt-3 flex-1 truncate font-semibold text-muted-foreground text-xs">
                    Why me?
                </h1>
                <p className="text-foreground text-sm">
                    A senior designer costs you $150K+ before benefits,
                    equipment, and management overhead, and you still only get
                    one skill set. With me, you get a designer, a developer, a
                    strategist, and a creative director for less than a single
                    hire. Little onboarding, minimal ramp-up.
                </p>
            </section>
            <section className="container mt-24">
                <Projects />
                <p className="mt-4 text-muted-foreground text-sm">
                    My focus these days is mainly on the web ecosystem.
                </p>
            </section>
            <Timezone />
            <footer className="container mt-16 flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-1">
                    <span className="text-[10px] text-muted-foreground/60">
                        <Globe
                            aria-hidden
                            className="mr-1 inline-block size-3"
                            focusable="false"
                        />
                        Based in Spain
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                        @ {new Date().getUTCFullYear()} GSMT. All rights
                        reserved.
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                        Have a great day!
                    </span>
                </div>
                <div className="inline-flex shrink gap-1 md:gap-2">
                    <div className="inline-flex flex-col">
                        <span className="truncate text-[10px] text-muted-foreground/60">
                            gsmt.link
                        </span>
                        <Link
                            className="truncate text-[10px] text-muted-foreground/60 underline underline-offset-4"
                            href="https://github.com/rortan134/gsmt"
                            target="_blank"
                        >
                            view source
                        </Link>
                    </div>
                    <Signature />
                </div>
            </footer>
            <React.Suspense fallback={null}>
                <UpdateServerViewCounter />
            </React.Suspense>
        </PageShell>
    );
}
