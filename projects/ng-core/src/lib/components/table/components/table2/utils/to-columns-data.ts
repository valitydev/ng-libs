import { Observable, scan, of, switchMap, combineLatest, share, race, timer } from 'rxjs';
import { map } from 'rxjs/operators';
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

function raceWithAsyncNull<T>(src$: Observable<T>): Observable<T | null> {
    return race(timer(0).pipe(switchMap(() => src$)), timer(100).pipe(map(() => null)));
}

export function toColumnsData<T extends object, C extends object>(
    src$: Observable<{ isTree: boolean; data: DisplayedData<T, C>; cols: NormColumn<T>[] }>,
): Observable<Map<DisplayedDataItem<T, C>, ColumnData>> {
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
                                            ).pipe(raceWithAsyncNull, share()),
                                            isChild: !d.value,
                                            isNextChild: !(data as TreeInlineData<T, C>)[idx + 1]
                                                ?.value,
                                        })),
                              ])
                            : ((data as T[]) || []).map((d, idx) => [
                                  d,
                                  isColsNotChanged && d === acc.data[idx]
                                      ? (acc.res.get(d) as never)
                                      : cols.map((c) => ({
                                            value: c.cell(d, idx).pipe(raceWithAsyncNull, share()),
                                        })),
                              ]),
                    ),
                    data: data,
                    cols: cols,
                };
            },
            { data: [], cols: [], res: new Map() } as {
                data: DisplayedData<T, C>;
                cols: NormColumn<T>[];
                res: Map<DisplayedDataItem<T, C>, ScanColumnData>;
            },
        ),
        switchMap((v) =>
            combineLatest(
                Array.from(v.res.values()).map((v) => combineLatest(v.map((cell) => cell.value))),
            ).pipe(
                map(
                    (res) =>
                        new Map(
                            Array.from(v.res.entries()).map(([k, v], idx) => [
                                k,
                                v.map((cell, colIdx) => ({ ...cell, value: res[idx][colIdx] })),
                            ]),
                        ),
                ),
            ),
        ),
    );
}
