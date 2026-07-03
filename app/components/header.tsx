import { LocaleSelector } from "@components/locale-selector";
import Link from "next/link";

const Header = ({ locale }: { locale: string }) => {
    const homeHref = locale === "en" ? "/" : `/${locale}`;

    return (
        <header className="container flex w-full items-center justify-between">
            <Link
                className="underline-offset-1 hover:underline hover:opacity-80"
                href={homeHref}
            >
                <h1 className="font-medium text-muted-foreground text-sm md:text-base">
                    @gsmt
                </h1>
            </Link>
            <LocaleSelector />
        </header>
    );
};

export { Header };
