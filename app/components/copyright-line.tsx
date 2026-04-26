"use client";

import { T, Var } from "gt-next";

const CopyrightLine = () => (
    <span className="text-[10px] text-muted-foreground/60">
        <T>
            @ <Var>{new Date().getUTCFullYear()}</Var> GSMT. All rights
            reserved.
        </T>
    </span>
);

export { CopyrightLine };
