"use client";

import { dayjs } from "@/app/lib/dayjs";
import { useLocaleSelector } from "gt-next/client";

const TodayDate = () => {
    const { locale } = useLocaleSelector();
    dayjs.locale(locale);
    return <>{dayjs().format("MMMM DD")}</>;
};

export { TodayDate };
