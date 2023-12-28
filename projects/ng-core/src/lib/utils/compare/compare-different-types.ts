/**
 * Use with sorting (arr.sort(fn))
 */
export function compareDifferentTypes<T>(a: T, b: T): number {
    return (typeof a === 'number' || /^\d+$/.test(String(a))) &&
        (typeof b === 'number' || /^\d+$/.test(String(a)))
        ? Number(a) - Number(b)
        : String(a).trim().localeCompare(String(b));
}
