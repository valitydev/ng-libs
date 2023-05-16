import { PickByValue } from 'utility-types';

export function getCleanIsoStringDates<T extends Record<PropertyKey, unknown>>(
    dates: T
): Record<keyof PickByValue<T, Date | undefined>, string> {
    return Object.fromEntries(
        Object.entries(dates)
            .filter(([, v]) => v instanceof Date)
            .map(([k, v]) => [k, (v as Date).toISOString()])
    ) as never;
}
