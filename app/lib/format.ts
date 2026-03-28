/**
 * Regex pattern to remove trailing .0 from formatted numbers
 */
const REG_PATTERN = /\.0$/;

// TODO: Use intl formatter instead

/**
 * Format a number with a suffix (k, M, B) for better readability
 * @param num The number to format
 * @returns Formatted string (e.g., 1000 -> 1k, 1000000 -> 1M)
 */
export function formatCompactNumber(num: number | string): string {
    if (num === undefined || num === null || num === "?") {
        return "?";
    }

    const value = typeof num === "string" ? Number.parseFloat(num) : num;
    if (Number.isNaN(value)) {
        return "?";
    }

    const isNegative = value < 0;
    const absValue = Math.abs(value);
    let formattedValue: string;

    if (absValue >= 1_000_000_000) {
        formattedValue = `${(absValue / 1_000_000_000)
            .toFixed(1)
            .replace(REG_PATTERN, "")}B`;
    } else if (absValue >= 1_000_000) {
        formattedValue = `${(absValue / 1_000_000)
            .toFixed(1)
            .replace(REG_PATTERN, "")}M`;
    } else if (absValue >= 1000) {
        formattedValue = `${(absValue / 1000)
            .toFixed(1)
            .replace(REG_PATTERN, "")}k`;
    } else {
        formattedValue = absValue.toString();
    }

    return isNegative ? `-${formattedValue}` : formattedValue;
}
