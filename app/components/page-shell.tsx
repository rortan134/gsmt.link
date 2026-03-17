import type * as React from "react";

const PageShell = (props: React.ComponentProps<"main">) => (
    <main
        id="main"
        {...props}
        className="gutter-stable relative isolate z-0 h-fit w-full min-w-0 max-w-full py-6 outline-hidden [-webkit-user-drag:none] focus-visible:outline-hidden"
        tabIndex={-1}
    />
);

export { PageShell };
