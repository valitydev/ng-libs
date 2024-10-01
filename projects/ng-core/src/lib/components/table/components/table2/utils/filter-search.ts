import { Sort } from '@angular/material/sort';

import { compareDifferentTypes } from '../../../../../utils';
import { NormColumn } from '../../../types';

import { DisplayedData, DisplayedDataItem } from './to-columns-data';

function filterData<T extends object, C extends object>(
    data: Map<DisplayedDataItem<T, C>, string[][]>,
    search: string,
) {
    const lowerCaseSearch = search.toLowerCase();
    return Array.from(data.entries())
        .map(([value, searchValuesCols]) => ({
            value,
            priority: searchValuesCols.reduce(
                (priority, searchValues) =>
                    searchValues.reduce((colPriority, searchValue, idx) => {
                        if (searchValue === search) {
                            colPriority += 1_000_000 - idx;
                        } else if (searchValue.includes(search)) {
                            colPriority += 1_000 - idx;
                        } else if (searchValue.toLowerCase().includes(lowerCaseSearch)) {
                            colPriority += 1 - idx;
                        }
                        return colPriority;
                    }, priority),
                0,
            ),
        }))
        .filter((v) => v.priority)
        .sort((a, b) => b.priority - a.priority)
        .map((v) => v.value);
}

function sortData<T extends object, C extends object>(
    source: DisplayedData<T, C>,
    data: Map<DisplayedDataItem<T, C>, string[][]>,
    columns: NormColumn<T, C>[],
    sort: Sort,
) {
    if (!sort.active) {
        return source;
    }
    const colIdx = columns.findIndex((c) => c.field === sort.active);
    const sortedData = source.sort((a, b) =>
        compareDifferentTypes((data.get(a) ?? [])[colIdx][0], (data.get(b) ?? [])[colIdx][0]),
    );
    return sort.direction === 'desc' ? sortedData.reverse() : sortedData;
}

export function filterSearch<T extends object, C extends object>({
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
    data: Map<DisplayedDataItem<T, C>, string[][]>;
    isTreeData: boolean;
    columns: NormColumn<T, C>[];
}) {
    if (isTreeData) {
        return source;
    }
    const filteredData = search ? filterData(data, search) : source.slice();
    return sortData(filteredData, data, columns, sort);
}
