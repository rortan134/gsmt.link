import { CopyToClipboard } from "@/app/components/copy-to-clipboard";
import { CopyrightLine } from "@/app/components/copyright-line";
import { Header } from "@/app/components/header";
import { Line } from "@/app/components/line";
import { PageShell } from "@/app/components/page-shell";
import { Signature } from "@/app/components/signature";
import { Timezone } from "@/app/components/timezone";
import { TodayDate } from "@/app/components/today-date";
import { cn } from "@/app/lib/cn";
import { formatCompactNumber } from "@/app/lib/format";
import { Carousel } from "@components/carousel";
import { LiveTimer } from "@components/live-timer";
import {
    getPageViewCount,
    UpdateServerViewCounter,
} from "@components/page-view-count";
import { TextHighlighter } from "@components/text-highlighter";
import { T } from "gt-next";
import { getLocales } from "gt-next/server";
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
import Link from "next/link";
import * as React from "react";

export const metadata: Metadata = {
    title: "Gilberto — Full-stack developer",
};

export async function generateStaticParams() {
    return getLocales().map((locale) => ({ locale }));
}

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
            <span className="sr-only">
                <T>Page Views</T>
            </span>
            {formatCompactNumber(pageViewCount)}&nbsp;
            <T context="views">page views</T>
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
            <span className="sr-only">
                <T>Page Views</T>
            </span>
            <span className="relative">
                00.0k
                <span className="absolute inset-0 z-10 animate-pulse rounded-md bg-gray-100" />
            </span>
            &nbsp;<T>page views</T>
        </span>
    );
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <PageShell>
            <Header locale={locale} />
            <section className="container relative mt-16 flex w-full items-center justify-between">
                <Line className="-top-20 left-5" variant="vertical" />
                <Line className="-top-20 right-6" variant="vertical" />
                <Line className="-top-20 right-14" variant="vertical" />
                <Line className="-top-16" />
                <Line className="-top-8" />
                <Line className="-top-1.5" />
                <Line className="top-8 w-11/12" />
                <div className="flex flex-col gap-y-3">
                    <h1 className="whitespace-nowrap font-medium font-serif text-foreground text-sm">
                        Gilberto
                    </h1>
                    <span className="whitespace-pre-wrap font-serif text-foreground text-xs">
                        <T>
                            <span className="mr-0.5 opacity-60">IPA</span>
                            &nbsp;
                            <i className="mr-0.5">/ˈɡɪlbət/</i>{" "}
                            —&nbsp;full-stack developer,{" "}
                            <span className="opacity-60">maker.</span>
                        </T>
                    </span>
                    <Line className="-top-20 -right-4" variant="vertical" />
                </div>
                <div className="relative flex items-end justify-end gap-3 md:gap-4">
                    <Line className="-top-20 -left-2" variant="vertical" />
                    <React.Suspense fallback={<PageViewsCounterFallback />}>
                        <PageViewsCounter />
                    </React.Suspense>
                    <LiveTimer />
                </div>
                <Line className="-bottom-1.5" />
            </section>
            <section className="container mt-4.5">
                <div className="group mb-1 flex flex-col items-center gap-3 md:flex-row">
                    <div className="relative flex h-fit w-full items-center md:w-fit">
                        <Link
                            className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent pr-11 pl-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                            href="mailto:gsmt.dev@gmail.com"
                            title="Email"
                        >
                            <Mail
                                aria-hidden
                                className="mr-3 size-4 opacity-50"
                                focusable="false"
                            />
                            <span className="sr-only">
                                <T>Email</T>
                            </span>
                            gsmt.dev@gmail.com
                        </Link>
                        <CopyToClipboard text="gsmt.dev@gmail.com">
                            <button
                                aria-label="Copy email"
                                className="group/btn absolute right-2 z-10 inline-flex size-5 items-center justify-center rounded-[40%] bg-card p-3 hover:opacity-100 active:opacity-50 group-hover:opacity-75"
                                title="Copy"
                                type="button"
                            >
                                <Clipboard
                                    aria-hidden
                                    className="size-4 transition-all group-data-[copied=true]/btn:opacity-0"
                                    focusable="false"
                                />
                                <Check
                                    aria-hidden
                                    className="absolute size-4 transition-all group-data-[copied=false]/btn:opacity-0"
                                    focusable="false"
                                />
                                <span className="sr-only">
                                    <T>Copy email</T>
                                </span>
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
                            className="mr-3 size-4 opacity-50"
                            focusable="false"
                        />
                        <span className="sr-only">
                            <T>X (formerly Twitter)</T>
                        </span>
                        <T>Twitter</T>
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
                            className="mr-3 size-4 opacity-50"
                            focusable="false"
                        />
                        <span className="sr-only">
                            <T>GitHub</T>
                        </span>
                        <T>GitHub</T>
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                    </Link>
                </div>
                <span className="text-emerald-700 text-xs">
                    <T>Available for work</T>
                </span>
            </section>
            <section className="container mt-20 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="flex-1 truncate font-semibold text-muted-foreground text-xs">
                        <T>Today</T>
                        <span className="ml-3 inline-block font-serif opacity-50">
                            <React.Suspense fallback={<span>—</span>}>
                                <TodayDate />
                            </React.Suspense>
                        </span>
                    </h2>
                    <div className="flex items-center justify-end space-x-3">
                        <svg
                            aria-hidden
                            className="opacity-50"
                            fill="none"
                            height="20"
                            viewBox="0 0 26 27"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>S2</title>
                            <g clipPath="url(#clip0_88_118)">
                                <path
                                    d="M10.1174 11.6474C6.74708 11.8966 6.48224 12.0978 6.15441 14.6595C5.90571 12.7111 5.69255 12.1281 4.12286 11.8519C3.93714 11.8183 3.73205 11.7912 3.50596 11.764C3.50435 11.764 3.50112 11.764 3.4995 11.764C3.12485 11.7209 2.69205 11.6858 2.19143 11.649C2.65006 11.6155 3.05217 11.582 3.40422 11.5436C3.40745 11.5436 3.40907 11.5436 3.41068 11.5436C3.76273 11.5053 4.06472 11.4622 4.32634 11.4063C5.00783 11.2625 5.40348 11.0405 5.65863 10.6301C5.73938 10.5007 5.80559 10.3538 5.86211 10.1829V10.1781C5.9913 9.79164 6.07205 9.29176 6.15441 8.63696C6.24485 9.34127 6.33044 9.8683 6.47578 10.266C6.47578 10.266 6.47578 10.2692 6.47578 10.2708C6.50484 10.3506 6.53714 10.4241 6.57106 10.4928C6.99416 11.3376 7.85975 11.4829 10.1142 11.649L10.1174 11.6474Z"
                                    fill="#000"
                                />
                                <path
                                    d="M23.4339 11.6474C20.0636 11.8966 19.7988 12.0978 19.4709 14.6595C19.2222 12.7111 19.0091 12.1281 17.4394 11.8519C17.2537 11.8183 17.0486 11.7912 16.8225 11.764C16.8193 11.764 16.8176 11.764 16.816 11.764C16.4414 11.7209 16.0086 11.6858 15.5079 11.649C15.9666 11.6155 16.3687 11.582 16.7207 11.5436C16.7224 11.5436 16.7256 11.5436 16.7272 11.5436C17.0793 11.5053 17.3812 11.4622 17.6429 11.4063C18.3243 11.2625 18.72 11.0405 18.9752 10.6301C19.0559 10.5007 19.1221 10.3538 19.1786 10.1829V10.1781C19.3078 9.79164 19.3886 9.29176 19.4709 8.63696C19.5614 9.34127 19.647 9.8683 19.7923 10.266C19.7923 10.266 19.7923 10.2692 19.7923 10.2708C19.8214 10.3506 19.8537 10.4241 19.8876 10.4928C20.3107 11.3376 21.1763 11.4829 23.4307 11.649L23.4339 11.6474Z"
                                    fill="#000"
                                />
                                <path
                                    d="M26 17.1188C14.9427 17.9349 14.0723 18.5961 13 26.9999C12.1845 20.61 11.4852 18.6951 6.33689 17.788C5.72807 17.681 5.05627 17.5868 4.31503 17.5021C4.30696 17.5021 4.29888 17.5005 4.29081 17.4989C3.06348 17.3584 1.64398 17.2402 0 17.1188C1.50671 17.007 2.82286 16.9 3.97752 16.7739C3.98559 16.7739 3.99366 16.7723 4.00012 16.7707C5.1564 16.6445 6.14795 16.5008 7.00224 16.3203C9.23888 15.8476 10.5373 15.1193 11.3722 13.773C11.6354 13.3498 11.8518 12.8643 12.0375 12.3085L12.0424 12.2925C12.4639 11.0244 12.7239 2.14475 12.9984 -0.00170898C13.2939 2.31084 13.5733 11.2752 14.0545 12.58C14.0561 12.5848 14.0578 12.5896 14.0594 12.5944C14.1547 12.8531 14.2596 13.0958 14.3743 13.3242C15.7631 16.0967 18.6021 16.5726 25.9984 17.1172L26 17.1188Z"
                                    fill="#000"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_88_118">
                                    <rect fill="white" height="27" width="26" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
                <T>
                    <p className="text-foreground text-sm">
                        Developer at heart, passionate about building a better
                        web,{" "}
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
                        . I&apos;m also a{" "}
                        <a
                            className="underline"
                            href="https://github.com/rortan134?tab=stars"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            fan of open-source software
                        </a>
                        &nbsp;
                        <Github
                            aria-hidden
                            className="inline-block size-4 opacity-50"
                            focusable="false"
                        />
                        , and cool looking watches{" "}
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
                        now. Playing with prototypes and doing everything from
                        data scrapers{" "}
                        <Braces
                            aria-hidden
                            className="inline-block size-4 opacity-50"
                            focusable="false"
                        />
                        , dynamic websites and APIs, charmful native
                        applications, shaders, fractal simulations, data
                        visualizations, engaging in-app experiences and more.
                        Outside of programming, I enjoy doing photography and
                        traveling{" "}
                        <TicketsPlane
                            aria-hidden
                            className="inline-block size-4 opacity-50"
                            focusable="false"
                        />
                        .
                    </p>
                </T>
                <T>
                    <p className="text-foreground text-sm">
                        I frequently enjoy owning more of the product lifecycle
                        with high-agency, including requirements, UX, traffic,
                        and conversion with responsibility for market success.
                    </p>
                </T>
            </section>
            <section className="container mt-20">
                <T>
                    <h2 className="mt-3 mb-4 flex-1 truncate font-semibold text-muted-foreground text-xs">
                        Experience
                    </h2>
                    <p className="mb-4 text-foreground text-sm">
                        Over the past years, I’ve been super lucky to work with
                        some amazing people, on a variety of great projects,
                        ranging from open-source libraries to large-scale
                        applications that are both challenging and rewarding.
                    </p>
                </T>
                <React.Suspense>
                    <Carousel>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                itemIQ
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Python
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    SP-API
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Redis
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Message Queues
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    High-concurrency
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Built the platform foundations for Amazon
                                    FBA and FBM sellers, replacing
                                    spreadsheet-heavy catalog workflows with
                                    automated profit analysis, opportunity
                                    detection, and smart restocking. I designed
                                    and implemented core backend and data
                                    pipelines across Python and TypeScript for
                                    ASIN ingestion, SP-API integration, fee and
                                    margin computation, and issue detection,
                                    helping sellers monitor thousands of ASINs,
                                    catch suppressed Buy Boxes or miscategorized
                                    listings, and save money.
                                </p>
                            </T>
                            <Link
                                className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                draggable={false}
                                href="https://item-iq.com/"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <T>
                                    <span>Visit project</span>
                                </T>
                                <ArrowUpRight
                                    aria-hidden
                                    className="mt-px inline-block size-3 opacity-80"
                                    focusable="false"
                                />
                                <span
                                    aria-hidden
                                    className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                />
                            </Link>
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                Infactura
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Next.js
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Prisma
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    PostgreSQL
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Stripe
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    SSR
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Led development of Infactura, an online
                                    invoicing platform for freelancers and SMEs
                                    in Spain focused on compliant electronic
                                    invoicing, faster payments, and alignment
                                    with AEAT, VeriFactu, and EU requirements.
                                    Built the multi-tenant app with TypeScript,
                                    React, Next.js, Prisma, and Postgres,
                                    including invoice templating, recurring
                                    billing, payment links, tax logic, automated
                                    dunning flows, and a strong emphasis on
                                    polished UX, typography, and branded
                                    documents.
                                </p>
                            </T>
                            <Link
                                className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                draggable={false}
                                href="https://infactura.com"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <T>
                                    <span>Visit project</span>
                                </T>
                                <ArrowUpRight
                                    aria-hidden
                                    className="mt-px inline-block size-3 opacity-80"
                                    focusable="false"
                                />
                                <span
                                    aria-hidden
                                    className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                />
                            </Link>
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                Cache
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    React
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    PostgreSQL
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Full-text Search
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    OAuth
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Vector DBs
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Created Cache, a browser-first app that
                                    brings bookmarks and saved content from
                                    different platforms into one searchable
                                    workspace. I focused on dependable ingestion
                                    pipelines, metadata normalization across
                                    sources, and fast client-side search and
                                    filtering, using modern React patterns, and
                                    a Postgres-backed sync layer to keep
                                    high-volume personal knowledge management
                                    responsive.
                                </p>
                            </T>
                            <Link
                                className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                draggable={false}
                                href="https://www.cachd.app"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <T>
                                    <span>Visit project</span>
                                </T>
                                <ArrowUpRight
                                    aria-hidden
                                    className="mt-px inline-block size-3 opacity-80"
                                    focusable="false"
                                />
                                <span
                                    aria-hidden
                                    className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                />
                            </Link>
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                MinuteDebate
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    WebSockets
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Real-time
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Generative AI
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Built MinuteDebate, a real-time debating
                                    game where two anonymous players argue a
                                    randomly assigned topic for 60 seconds each
                                    while an AI judge scores persuasion and
                                    coherence. I designed the game loop,
                                    low-latency real-time interactions, the
                                    interface, and the LLM-powered evaluation
                                    pipeline so players receive instant,
                                    structured feedback.
                                </p>
                            </T>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://minutedebate.com"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <T>
                                        <span>Visit project</span>
                                    </T>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/minutedebate"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <T>
                                        <span>View source</span>
                                    </T>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                gsmt
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Next.js
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Three.js
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Tailwind CSS
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Framer Motion
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    GSAP
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Designed and developed gsmt as both my
                                    portfolio and a live playground for
                                    interaction design, typography, and
                                    performance experiments. It works as a
                                    testbed for animations, layout systems, and
                                    reusable component abstractions that later
                                    inform production work, while staying
                                    minimal, fast, and content-first.
                                </p>
                            </T>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://gsmt.link"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <T>
                                        <span>Visit project</span>
                                    </T>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/gsmt"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <T>
                                        <span>View source</span>
                                    </T>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <T>
                                <h2 className="font-medium text-muted-foreground text-xs">
                                    Developer Tools & UI Utilities
                                </h2>
                            </T>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    TypeScript
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    React
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Electron
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Webpack
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Vite
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Open Source
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Built focused tools for developers such as
                                    cleaning-mode, an Electron utility that
                                    temporarily disables keyboard and touch
                                    input so devices can be cleaned safely,
                                    alongside libraries like use-selectify,
                                    use-gif, and react-bypass. These projects
                                    reflect my interest in ergonomic APIs,
                                    well-scoped abstractions, and closing the
                                    gap between interaction design and
                                    implementation.
                                </p>
                            </T>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/cleaning-mode"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>cleaning-mode</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://useselectify.js.org/"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>use-selectify</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/use-gif"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>use-gif</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/react-bypass"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>react-bypass</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <T>
                                <h2 className="font-medium text-muted-foreground text-xs">
                                    Creative Coding & Simulations
                                </h2>
                            </T>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Canvas
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    WebGL
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    GLSL
                                </span>
                                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                    Blender
                                </span>
                            </div>
                            <T>
                                <p className="text-foreground text-xs">
                                    Created a range of creative coding
                                    experiments including Mandelbrot renderers,
                                    chaos-equation visualizers, shaders, and
                                    fluid and particle simulations. These
                                    explorations pushed my understanding of
                                    WebGL, canvas, numerical methods, and
                                    browser performance while sharpening my
                                    instincts for data visualization and motion
                                    aesthetics.
                                </p>
                            </T>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/mandelbrot"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>mandelbrot</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/chaos-equations"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>chaos-equations</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                                <Link
                                    className="relative flex w-fit items-center gap-x-1 text-muted-foreground text-xs hover:underline"
                                    draggable={false}
                                    href="https://github.com/rortan134/fractals"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                >
                                    <span>fractals</span>
                                    <ArrowUpRight
                                        aria-hidden
                                        className="mt-px inline-block size-3 opacity-80"
                                        focusable="false"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 top-1/2 left-1/2 h-11 w-[calc(100%+24px)] -translate-x-1/2 -translate-y-1/2"
                                    />
                                </Link>
                            </div>
                        </div>
                    </Carousel>
                </React.Suspense>
            </section>
            <React.Suspense
                fallback={
                    <section className="container mt-20 grid w-full gap-6 md:grid-cols-2">
                        <div className="h-24 rounded-xl border border-border" />
                        <div className="h-24 rounded-xl border border-border" />
                    </section>
                }
            >
                <Timezone />
            </React.Suspense>
            <footer className="container mt-16 flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-1">
                    <span className="text-[10px] text-muted-foreground/60">
                        <Globe
                            aria-hidden
                            className="mr-1 inline-block size-3"
                            focusable="false"
                        />
                        <T>Based in Spain</T>
                    </span>
                    <React.Suspense
                        fallback={
                            <span className="text-[10px] text-muted-foreground/60">
                                <T>@ — GSMT. All rights reserved.</T>
                            </span>
                        }
                    >
                        <CopyrightLine />
                    </React.Suspense>
                    <span className="text-[10px] text-muted-foreground/60">
                        <T>Have a great day!</T>
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
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            <T>view source</T>
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
