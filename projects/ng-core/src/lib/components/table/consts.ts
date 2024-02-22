import { Sort, MatSort } from '@angular/material/sort';

export const COMPLETE_MISMATCH_SCORE = 1;
export const DEFAULT_SORT: Sort = { active: '', direction: '' };
export const DEFAULT_DEBOUNCE_TIME_MS = 250;
export const DEFAULT_SORT_DATA: <T>(data: T[], sort: MatSort) => T[] = (data) => data;
