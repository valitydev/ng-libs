import { Observable, scan, of, switchMap, combineLatest, throttleTime, timer } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { Overwrite } from 'utility-types';

import { Value } from '../../../../value';
import { NormColumn } from '../../../types';
import { TreeInlineDataItem, TreeInlineData } from '../tree-data';

export type DisplayedDataItem<T extends object, C extends object> = TreeInlineDataItem<T, C> | T;
export type DisplayedData<T extends object, C extends object> = TreeInlineData<T, C> | T[];

export type ColumnDataItem = {
    value: Value | null;
    lazyValue?: Observable<Value>;
    isChild?: boolean;
    isNextChild?: boolean;
};
export type ColumnData = ColumnDataItem[];

type ScanColumnDataItem = Overwrite<ColumnDataItem, { value: Observable<Value | null> }>;
type ScanColumnData = ScanColumnDataItem[];

function toScannedValue(src$: Observable<Value>) {
    return src$.pipe(
        shareReplay({
            bufferSize: 1,
            refCount: true,
        }),
    );
}

export function toObservableColumnsData<T extends object, C extends object>(
    src$: Observable<{ isTree: boolean; data: DisplayedData<T, C>; cols: NormColumn<T>[] }>,
): Observable<Map<DisplayedDataItem<T, C>, ScanColumnData>> {
    return src$.pipe(
        scan(
            (acc, { isTree, data, cols }) => {
                const isColsNotChanged = acc.cols === cols;
                return {
                    res: new Map<TreeInlineDataItem<T, C> | T, ScanColumnData>(
                        isTree
                            ? (data as TreeInlineData<T, C>).map((d, idx) => [
                                  d,
                                  isColsNotChanged &&
                                  d === acc.data[idx] &&
                                  // This is not the last value, because we need to calculate isNextChild
                                  idx !== acc.data.length - 1
                                      ? (acc.res.get(d) as ScanColumnData)
                                      : cols.map((c) => ({
                                            value: (d.child && c.child
                                                ? c.child(d.child, idx)
                                                : d.value
                                                  ? c.cell(d.value, idx)
                                                  : of<Value>({ value: '' })
                                            ).pipe(toScannedValue),
                                            isChild: !d.value,
                                            isNextChild: !(data as TreeInlineData<T, C>)[idx + 1]
                                                ?.value,
                                        })),
                              ])
                            : (data as T[]).map((d, idx) => [
                                  d,
                                  isColsNotChanged && d === acc.data[idx]
                                      ? (acc.res.get(d) as ScanColumnData)
                                      : cols.map((c) => ({
                                            value: c.cell(d, idx).pipe(toScannedValue),
                                        })),
                              ]),
                    ),
                    data,
                    cols,
                };
            },
            { data: [], cols: [], res: new Map() } as {
                data: DisplayedData<T, C>;
                cols: NormColumn<T>[];
                res: Map<DisplayedDataItem<T, C>, ScanColumnData>;
            },
        ),
        map(({ res }) => res),
    );
}

export function toColumnsData<T extends object, C extends object>(
    src$: Observable<Map<DisplayedDataItem<T, C>, ScanColumnData>>,
): Observable<Map<DisplayedDataItem<T, C>, ColumnData>> {
    return src$.pipe(
        switchMap((columnsData) =>
            combineLatest(
                Array.from(columnsData.values()).map((v) =>
                    combineLatest(v.map((cell) => timer(0).pipe(switchMap(() => cell.value)))),
                ),
            ).pipe(
                map(
                    (res) =>
                        new Map(
                            Array.from(columnsData.entries()).map(([k, v], idx) => [
                                k,
                                v.map((cell, colIdx) => ({ ...cell, value: res[idx][colIdx] })),
                            ]),
                        ),
                ),
            ),
        ),
        throttleTime(100),
    );
}
