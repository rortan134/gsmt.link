"use client";

import { dayjs } from "@/app/lib/dayjs";
import { useLocaleSelector } from "gt-next/client";
import * as React from "react";

const LiveTimer = () => {
    const { locale } = useLocaleSelector();
    dayjs.locale(locale);

    const [time, setTime] = React.useState("00:00:00");
    React.useLayoutEffect(() => {
        setTime(dayjs().format("HH:mm:ss"));
        const intervalId = window.setInterval(() => {
            setTime(dayjs().format("HH:mm:ss"));
        }, 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <span
            aria-hidden
            className="select-all font-light font-mono text-muted-foreground text-xs tracking-wide opacity-40 mix-blend-soft-light [text-orientation:mixed] [writing-mode:vertical-rl]"
        >
            {time}
        </span>
    );
};

export { LiveTimer };
