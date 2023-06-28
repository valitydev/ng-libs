import { isEqual } from 'date-fns';

import { DateRange } from '../types/date-range';

export function isEqualDateRange(a: DateRange, b: DateRange) {
    return isEqual(a.start, b.start) && isEqual(a.end, b.end);
}
