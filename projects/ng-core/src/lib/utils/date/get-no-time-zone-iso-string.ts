import { removeTimeZone } from './remove-time-zone';

export function getNoTimeZoneIsoString(date?: Date | null): string {
    return date ? removeTimeZone(date).toISOString() : '';
}
