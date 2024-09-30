function isNumber(a: unknown): boolean {
    return typeof a === 'number' || /^\d+$/.test(String(a));
}

/**
 * Use with sorting (arr.sort(fn))
 */
export function compareDifferentTypes<T>(a: T, b: T): number {
    const aIsNum = isNumber(a);
    const bIsNum = isNumber(b);
    if (aIsNum || bIsNum) {
        if (aIsNum && bIsNum) {
            return Number(a) - Number(b);
        } else if (aIsNum) {
            return -1;
        } else {
            return 1;
        }
    }
    return String(a).localeCompare(String(b));
}
