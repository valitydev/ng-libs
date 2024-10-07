function isNumber(v: unknown): boolean {
    return typeof v === 'number' || /^\d+$/.test(String(v));
}

function toNumber(v: unknown): number {
    return typeof v === 'string'
        ? parseFloat(v.replace(',', '.').replace(/[^0-9.-]+/g, ''))
        : Number(v);
}

/**
 * Use with sorting (arr.sort(fn))
 */
export function compareDifferentTypes<T>(a: T, b: T): number {
    const aIsNum = isNumber(typeof a === 'string' ? a[0] : a);
    const bIsNum = isNumber(typeof b === 'string' ? b[0] : b);
    if (aIsNum || bIsNum) {
        if (aIsNum && bIsNum) {
            return toNumber(a) - toNumber(b);
        } else if (aIsNum) {
            return -1;
        } else {
            return 1;
        }
    }
    return String(a).localeCompare(String(b));
}
