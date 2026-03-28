"use client";

import { Clock } from "@/app/components/clock";
import { dayjs } from "@/app/lib/dayjs";
import { T } from "gt-next";
import { useLocaleSelector } from "gt-next/client";
import * as React from "react";

const BASE_TIMEZONE = "Europe/Madrid";

const Timezone = () => {
    const { locale } = useLocaleSelector();
    dayjs.locale(locale);

    const [, forceRender] = React.useState(0);
    React.useEffect(() => {
        const intervalId = window.setInterval(
            () => React.startTransition(() => forceRender((prev) => prev + 1)),
            5000
        );
        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <section className="container mt-20 grid w-full gap-6 md:grid-cols-2">
            <div className="flex w-full flex-col space-y-2">
                <h3 className="text-foreground text-sm">
                    <T>Your timezone</T>
                </h3>
                <div className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center space-x-3">
                        <Clock timezone={dayjs.tz.guess()} />
                        <div className="flex flex-col space-y-1">
                            <span className="font-medium text-muted-foreground text-xs">
                                {dayjs.tz.guess()}
                            </span>
                            <span className="text-muted-foreground/75 text-xs">
                                ({dayjs().format("z")})
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                        <span className="font-medium text-muted-foreground/90 text-xs">
                            {dayjs().format("h:mm A")}
                        </span>
                        <span className="text-muted-foreground/75 text-xs">
                            {dayjs().format("ddd, MMM DD, YYYY")}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col space-y-2">
                <h3 className="text-foreground text-sm">
                    <T>My timezone</T>
                </h3>
                <div className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center space-x-3">
                        <Clock timezone={BASE_TIMEZONE} />
                        <div className="flex flex-col space-y-1">
                            <span className="font-medium text-muted-foreground text-xs">
                                {BASE_TIMEZONE}
                            </span>
                            <span className="text-muted-foreground/75 text-xs">
                                ({dayjs().tz(BASE_TIMEZONE).format("z")})
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                        <span className="font-medium text-muted-foreground/90 text-xs">
                            {dayjs().tz(BASE_TIMEZONE).format("h:mm A")}
                        </span>
                        <span className="text-muted-foreground/75 text-xs">
                            {dayjs()
                                .tz(BASE_TIMEZONE)
                                .format("ddd, MMM DD, YYYY")}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Timezone };
