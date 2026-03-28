"use client";

import { cn } from "@/app/lib/cn";
import { useLocaleSelector } from "gt-next/client";
import { useRouter } from "next/navigation";

const LocaleSelector = () => {
    const { locale, locales, getLocaleProperties } = useLocaleSelector();
    const router = useRouter();

    if (!locales?.length) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const href = value === "en" ? "/" : `/${value}`;
        router.push(href);
    };

    return (
        <label className="relative inline-flex items-center">
            <span className="sr-only">Change language</span>
            <select
                aria-label="Change language"
                className={cn(
                    "appearance-none rounded-full border border-border bg-transparent py-1 pr-6 pl-2.5",
                    "font-medium text-muted-foreground text-xs",
                    "transition-colors duration-150",
                    "hover:border-muted-foreground/40 hover:text-foreground",
                    "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    "cursor-pointer"
                )}
                onChange={handleChange}
                title="Change language"
                value={locale ?? "en"}
            >
                {locales.map((loc) => {
                    const props = getLocaleProperties(loc);
                    const name = props?.nativeLanguageName ?? loc;
                    const displayName =
                        name.charAt(0).toUpperCase() + name.slice(1);
                    return (
                        <option key={loc} value={loc}>
                            {displayName}
                        </option>
                    );
                })}
            </select>
            <svg
                aria-hidden
                className="pointer-events-none absolute right-2 size-3 opacity-50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <title>Select</title>
                <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </label>
    );
};

export { LocaleSelector };
