export function getEndOfDay<T extends Date | null>(date?: T): T extends Date ? Date : null {
    if (!date) return null as never;
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);
    return endDate as never;
}
