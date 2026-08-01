import { CopyToClipboard } from "@/app/components/copy-to-clipboard";
import { CopyrightLine } from "@/app/components/copyright-line";
import { ExternalLink } from "@/app/components/external-link";
import { Header } from "@/app/components/header";
import { Line } from "@/app/components/line";
import { Monogram } from "@/app/components/monogram";
import { PageShell } from "@/app/components/page-shell";
import { Signature } from "@/app/components/signature";
import { Timezone } from "@/app/components/timezone";
import { TodayDate } from "@/app/components/today-date";
import ProfilePicture from "@/public/pfp.jpg";
import { Carousel } from "@components/carousel";
import { getLocales, T } from "gt-next";
import {
    Braces,
    Check,
    Clipboard,
    Github,
    Globe,
    Mail,
    MapPin,
    TicketsPlane,
    Twitter,
    Watch,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export const metadata: Metadata = {
    title: "Gilberto S.",
};

export async function generateStaticParams() {
    return getLocales().map((locale) => ({ locale }));
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
            <section className="container relative mt-16 flex w-full items-end justify-between">
                <Line className="-top-20 left-5" variant="vertical" />
                <Line className="-top-20 right-5" variant="vertical" />
                <Line className="-top-14" />
                <Line className="-top-1.5" />
                <Line className="top-10 w-10/11" />
                <Line className="-bottom-2" />
                <div className="flex w-full items-end justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="whitespace-nowrap font-medium font-serif text-base text-foreground">
                            Gilberto S
                        </h1>
                        <span className="relative whitespace-pre-wrap font-serif text-foreground text-xs">
                            <T>
                                <span className="mr-0.5 opacity-60">IPA</span>
                                &nbsp;
                                <i className="mr-0.5">/ˈɡɪl.bə.to/</i>{" "}
                                —&nbsp;full-stack
                            </T>
                            <Line
                                className="-top-24 -right-2"
                                variant="vertical"
                            />
                        </span>
                    </div>
                    <div className="flex items-end justify-end gap-4">
                        <div className="flex items-center justify-end gap-1 whitespace-pre-wrap font-serif text-foreground text-xs">
                            <MapPin className="size-3.5" />
                            <T context="Location">Barcelona, Spain</T>
                        </div>
                        <Image
                            alt=""
                            className="hidden aspect-square size-16 rounded-sm object-cover sm:block"
                            loading="eager"
                            src={ProfilePicture}
                        />
                    </div>
                </div>
            </section>
            <section className="container mt-4.5">
                <div className="group flex flex-col items-center gap-4 md:flex-row">
                    <div className="relative flex h-fit w-full items-center md:w-fit">
                        <Link
                            className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent pr-11 pl-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                            href="mailto:gsmt.dev+hi@gmail.com"
                            title="Email"
                        >
                            <Mail className="mr-3 size-4 opacity-50" />
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
                                <Clipboard className="size-4 transition-all group-data-[copied=true]/btn:opacity-0" />
                                <Check className="absolute size-4 transition-all group-data-[copied=false]/btn:opacity-0" />
                                <span className="sr-only">
                                    <T>Copy email</T>
                                </span>
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Link
                        className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent px-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                        href="https://github.com/rortan134"
                        rel="noreferrer"
                        target="_blank"
                        title="GitHub"
                    >
                        <Github className="mr-3 size-4 opacity-50" />
                        GitHub
                    </Link>
                    <Link
                        className="flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl border bg-transparent px-4 text-sm hover:opacity-100 active:opacity-50 group-hover:opacity-75 md:w-fit"
                        href="https://twitter.com/gsmmtt"
                        rel="noreferrer"
                        target="_blank"
                        title="Twitter"
                    >
                        <Twitter className="mr-3 size-4 opacity-50" />
                        X/Twitter
                    </Link>
                </div>
            </section>
            <section className="container mt-20 flex flex-col space-y-6">
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
                        <Monogram />
                    </div>
                </div>
                <T>
                    <p className="text-foreground text-sm">
                        Developer at heart, passionate about creating great
                        experiences, and trying to solve real-world{" "}
                        <Globe className="inline-block size-4 opacity-50" />{" "}
                        problems through software with an eye for design.
                        I&apos;m also a{" "}
                        <a
                            className="underline"
                            href="https://github.com/rortan134?tab=stars"
                            rel="noreferrer"
                            target="_blank"
                        >
                            fan of open-source
                        </a>
                        &nbsp;
                        <Github className="inline-block size-4 opacity-50" />{" "}
                        and often contribute to the tools I use.
                    </p>
                </T>
                <T>
                    <p className="text-foreground text-sm">
                        I've built software across data pipelines{" "}
                        <Braces className="inline-block size-4 opacity-50" />,
                        dynamic web apps and APIs, charming native applications,
                        shaders, fractal simulations, data visualizations, and
                        engaging in-app interactions. I take pride in often
                        owning critical parts of a product and pushing things
                        forward. I believe that a strong focus on{" "}
                        <Link
                            className="underline"
                            href="/fundamentals"
                            rel="noreferrer"
                            target="_blank"
                        >
                            fundamentals
                        </Link>{" "}
                        drives the greatest progress.
                    </p>
                </T>
                <T>
                    <p className="text-foreground text-sm">
                        Outside of work, I continue to be a high-energy person.
                        I&apos;m a swimming athlete who enjoys traveling{" "}
                        <TicketsPlane className="inline-block size-4 opacity-50" />
                        , the gym, and cool looking watches
                        <Watch className="inline-block size-4 opacity-50" />.
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
                                ItemIQ
                            </h2>
                            <ExternalLink href="https://item-iq.com/">
                                <T>Visit</T>
                            </ExternalLink>
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
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                Infactura
                            </h2>
                            <ExternalLink href="https://infactura.com">
                                <T>Visit</T>
                            </ExternalLink>
                            <T>
                                <p className="text-foreground text-xs">
                                    Core development of Infactura, an online
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
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                Cache App
                            </h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <ExternalLink href="https://www.cachd.app">
                                    <T>Visit</T>
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/cache-app">
                                    <T>View source</T>
                                </ExternalLink>
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
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                MinuteDebate
                            </h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <ExternalLink href="https://minutedebate.com">
                                    <T>Visit</T>
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/minutedebate">
                                    <T>View source</T>
                                </ExternalLink>
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
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <h2 className="font-medium text-muted-foreground text-xs">
                                gsmt.link
                            </h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <ExternalLink href="https://gsmt.link">
                                    <T>Visit</T>
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/gsmt">
                                    <T>View source</T>
                                </ExternalLink>
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
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <T>
                                <h2 className="font-medium text-muted-foreground text-xs">
                                    Developer Tools & UI Utilities
                                </h2>
                            </T>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <ExternalLink href="https://github.com/rortan134/cleaning-mode">
                                    cleaning-mode
                                </ExternalLink>
                                <ExternalLink href="https://useselectify.js.org/">
                                    use-selectify
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/use-gif">
                                    use-gif
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/react-bypass">
                                    react-bypass
                                </ExternalLink>
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
                        </div>
                        <div className="flex h-max min-h-full flex-1 flex-col gap-y-4 p-4">
                            <T>
                                <h2 className="font-medium text-muted-foreground text-xs">
                                    Creative Coding & Simulations
                                </h2>
                            </T>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <ExternalLink href="https://github.com/rortan134/mandelbrot">
                                    mandelbrot
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/chaos-equations">
                                    chaos-equations
                                </ExternalLink>
                                <ExternalLink href="https://github.com/rortan134/fractals">
                                    fractals
                                </ExternalLink>
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
                            rel="noreferrer"
                            target="_blank"
                        >
                            <T>view source</T>
                        </Link>
                    </div>
                    <Signature />
                </div>
            </footer>
        </PageShell>
    );
}
