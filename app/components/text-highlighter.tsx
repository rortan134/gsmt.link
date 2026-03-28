"use client";

import { cn } from "@/app/lib/cn";
import {
    motion,
    useInView,
    type Transition,
    type UseInViewOptions,
} from "motion/react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt";

export interface TextHighlighterHandle {
    animate: (animationDirection?: HighlightDirection) => void;
    reset: () => void;
}

interface TextHighlighterProps
    extends Omit<React.ComponentProps<"span">, "ref"> {
    ref?: React.Ref<TextHighlighterHandle>;
    delay?: number;

    /**
     * Direction of the highlight animation
     * @default "ltr" (left to right)
     */
    direction?: HighlightDirection;

    /**
     * Highlight color (CSS color string). Also can be a function that returns a color string, eg:
     * @default 'hsl(60, 90%, 68%)' (yellow)
     */
    highlightColor?: string;

    /**
     * Animation transition configuration
     */
    transition?: Transition;

    /**
     * How to trigger the animation
     * @default "inView"
     */
    triggerType?: "hover" | "ref" | "inView" | "auto";

    /**
     * Options for useInView hook when triggerType is "inView"
     */
    useInViewOptions?: UseInViewOptions;
}

const TextHighlighter = ({
    children,
    triggerType = "inView",
    transition = { bounce: 0, delay: 1, duration: 1, type: "spring" },
    useInViewOptions = {
        amount: 0.1,
        initial: false,
        once: true,
    },
    className,
    highlightColor = "hsl(25, 90%, 80%)",
    direction = "ltr",
    ref,
    delay = 1,
    ...props
}: TextHighlighterProps) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentDirection, setCurrentDirection] =
        useState<HighlightDirection>(direction);

    // change the direction whenever the direction prop changes
    useEffect(() => {
        setCurrentDirection(direction);
    }, [direction]);

    const isInView = useInView(componentRef, useInViewOptions);

    useImperativeHandle(ref, () => ({
        animate: (animationDirection?: HighlightDirection) => {
            if (animationDirection) {
                setCurrentDirection(animationDirection);
            }
            setIsAnimating(true);
        },
        reset: () => setIsAnimating(false),
    }));

    const shouldAnimate = (() => {
        switch (triggerType) {
            case "hover":
                return isHovered;
            case "inView":
                return isInView;
            case "ref":
                return isAnimating;
            case "auto":
                return true;
            default:
                return false;
        }
    })();

    const getBackgroundSize = (animated: boolean) => {
        switch (currentDirection) {
            case "ltr":
                return animated ? "100% 100%" : "0% 100%";
            case "rtl":
                return animated ? "100% 100%" : "0% 100%";
            case "ttb":
                return animated ? "100% 100%" : "100% 0%";
            case "btt":
                return animated ? "100% 100%" : "100% 0%";
            default:
                return animated ? "100% 100%" : "0% 100%";
        }
    };

    const getBackgroundPosition = () => {
        switch (currentDirection) {
            case "ltr":
                return "0% 0%";
            case "rtl":
                return "100% 0%";
            case "ttb":
                return "0% 0%";
            case "btt":
                return "0% 100%";
            default:
                return "0% 0%";
        }
    };

    const animatedSize = getBackgroundSize(shouldAnimate);
    const initialSize = getBackgroundSize(false);
    const backgroundPosition = getBackgroundPosition();

    const highlightStyle = {
        backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
        backgroundPosition,
        backgroundRepeat: "no-repeat",
        backgroundSize: animatedSize,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
    } as React.CSSProperties;

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: temp
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: temp
        <span
            onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
            onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
            ref={componentRef}
            {...props}
        >
            <motion.span
                animate={{ backgroundSize: animatedSize }}
                className={cn("inline rounded-[0.3em] px-px", className)}
                initial={{ backgroundSize: initialSize }}
                style={highlightStyle}
                transition={{
                    ...transition,
                    delay,
                }}
            >
                {children}
            </motion.span>
        </span>
    );
};

export { TextHighlighter };
