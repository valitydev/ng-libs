export function removeTimeZone(date: Date): Date {
    return new Date(date.valueOf() - date.getTimezoneOffset() * 60_000);
}

export function addTimeZone(date: Date): Date {
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60_000);
}
