import { runInInjectionContext, Injector, inject } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { compareDifferentTypes } from '../../../../../utils';
import { valueToString } from '../../../../value/utils/value-to-string';
import { NormColumn } from '../../../types';
import { normalizeString } from '../../../utils/normalize-string';

import { DisplayedData, DisplayedDataItem, ColumnData } from './to-columns-data';

export type FilterSearchData<T extends object, C extends object> = Map<
    DisplayedDataItem<T, C>,
    { byColumns: string[][]; byRow: string }
>;

export function columnsDataToFilterSearchData<T extends object, C extends object>(
    src$: Observable<Map<DisplayedDataItem<T, C>, ColumnData>>,
) {
    const injector = inject(Injector);
    return src$.pipe(
        map(
            (data) =>
                new Map(
                    Array.from(data.entries()).map(([item, value]) => [
                        item,
                        {
                            byColumns: value.map((el) => [
                                runInInjectionContext(injector, () =>
                                    normalizeString(valueToString(el?.value)),
                                ),
                                normalizeString(String(el?.value?.description ?? '')),
                            ]),
                            byRow: JSON.stringify(item),
                        },
                    ]),
                ),
        ),
    );
}

function getWeight(
    searchValue: string,
    search: string,
    lowerCaseSearch: string,
    unimportance: number = 0,
) {
    if (searchValue === search) {
        return 1000000 - unimportance;
    } else if (searchValue.includes(search)) {
        return 10000 - unimportance;
    } else if (searchValue.toLowerCase().includes(lowerCaseSearch)) {
        return 100 - unimportance;
    }
    return 0;
}

function filterData<T extends object, C extends object>(
    data: FilterSearchData<T, C>,
    search: string,
) {
    const lowerCaseSearch = search.toLowerCase();
    return Array.from(data.entries())
        .map(([value, searchValuesCols]) => ({
            value,
            priority:
                searchValuesCols.byColumns.reduce(
                    (priority, searchValues) =>
                        searchValues.reduce(
                            (colPriority, searchValue, idx) =>
                                colPriority + getWeight(searchValue, search, lowerCaseSearch, idx),
                            priority,
                        ),
                    0,
                ) + getWeight(searchValuesCols.byRow, search, lowerCaseSearch, 1),
        }))
        .filter((v) => v.priority)
        .sort((a, b) => b.priority - a.priority)
        .map((v) => v.value);
}

function sortData<T extends object, C extends object>(
    source: DisplayedData<T, C>,
    data: FilterSearchData<T, C>,
    columns: NormColumn<T, C>[],
    sort: Sort,
) {
    if (!sort?.active || !sort?.direction) {
        return source;
    }
    const colIdx = columns.findIndex((c) => c.field === sort.active);
    const sortedData = source.sort((a, b) =>
        compareDifferentTypes(
            (data.get(a)?.byColumns ?? [])[colIdx]?.[0],
            (data.get(b)?.byColumns ?? [])[colIdx]?.[0],
        ),
    );
    return sort.direction === 'desc' ? sortedData.reverse() : sortedData;
}

export function filterSort<T extends object, C extends object>({
    search,
    sort,
    source,
    data,
    isTreeData,
    columns,
}: {
    search: string;
    sort: Sort;
    source: DisplayedData<T, C>;
    data: FilterSearchData<T, C>;
    isTreeData: boolean;
    columns: NormColumn<T, C>[];
}) {
    if (isTreeData) {
        return source;
    }
    const filteredData = search ? filterData(data, search) : source.slice();
    return sortData(filteredData, data, columns, sort);
}
