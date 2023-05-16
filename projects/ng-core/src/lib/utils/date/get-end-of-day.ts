export function getEndOfDay(date?: Date | null): Date | null {
    if (!date) return null;
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);
    return endDate;
}
