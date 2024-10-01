import { Observable, scan, of } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { Value } from '../../../../value';
import { NormColumn } from '../../../types';
import { TreeInlineDataItem, TreeInlineData } from '../table2.component';

type DisplayedDataItem<T extends object, C extends object> = TreeInlineDataItem<T, C> | T;
type DisplayedData<T extends object, C extends object> = TreeInlineData<T, C> | T[];

type ColumnDataItem = { value: Observable<Value>; isChild?: boolean; isNextChild?: boolean };
type ColumnData = ColumnDataItem[];

export function toColumnsData<T extends object, C extends object>(
    src$: Observable<{ isTree: boolean; data: DisplayedData<T, C>; cols: NormColumn<T>[] }>,
): Observable<Map<DisplayedDataItem<T, C>, ColumnData>> {
    return src$.pipe(
        scan(
            (acc, { isTree, data, cols }) => {
                const isColsNotChanged = acc.cols === cols;
                return {
                    res: new Map<
                        TreeInlineDataItem<T, C> | T,
                        { value: Observable<Value>; isChild?: boolean; isNextChild?: boolean }[]
                    >(
                        isTree
                            ? (data as TreeInlineData<T, C>).map((d, idx) => [
                                  d,
                                  isColsNotChanged &&
                                  d === acc.data[idx] &&
                                  // This is not the last value, because we need to calculate isNextChild
                                  idx !== acc.data.length - 1
                                      ? (acc.res.get(d) as never)
                                      : cols.map((c) => ({
                                            value: (d.child && c.child
                                                ? c.child(d.child, idx)
                                                : d.value
                                                  ? c.cell(d.value, idx)
                                                  : of<Value>({ value: '' })
                                            ).pipe(
                                                shareReplay({
                                                    refCount: true,
                                                    bufferSize: 1,
                                                }),
                                            ),
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
                                            value: c.cell(d, idx).pipe(
                                                shareReplay({
                                                    refCount: true,
                                                    bufferSize: 1,
                                                }),
                                            ),
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
                res: Map<DisplayedDataItem<T, C>, ColumnData>;
            },
        ),
        map((v) => v.res),
    );
}
