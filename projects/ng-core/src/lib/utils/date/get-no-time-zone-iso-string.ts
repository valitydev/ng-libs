import { addTimeZone, removeTimeZone } from './remove-time-zone';

export function getNoTimeZoneIsoString(date?: Date | null): string {
    return date ? removeTimeZone(date).toISOString() : '';
}
export function createDateFromNoTimeZoneString(date: string): Date {
    return addTimeZone(new Date(date));
}
