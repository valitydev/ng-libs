import { get } from 'lodash-es';
import startCase from 'lodash-es/startCase';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { PossiblyAsync, getPossiblyAsyncObservable } from '../../../utils';
import { Value } from '../../value';

type Fn<R, P extends Array<unknown> = []> = (...args: P) => R;
type PossiblyFn<R, P extends Array<unknown> = []> = Fn<R, P> | R;
type ColumnValue = Value | string;

type CellFnArgs<T extends object> = [data: T, index: number];

export interface Column2<T extends object> {
    field: string;
    header?: PossiblyAsync<ColumnValue>;
    cell?: PossiblyFn<PossiblyAsync<ColumnValue>, CellFnArgs<T>>;
}

export interface NormalizedColumn2<T extends object> {
    field: string;
    header: Observable<Value>;
    cell: Fn<Observable<Value>, CellFnArgs<T>>;
}

export function normalizePossiblyFn<R, P extends Array<unknown>>(fn: PossiblyFn<R, P>): Fn<R, P> {
    return typeof fn === 'function' ? (fn as Fn<R, P>) : () => fn;
}

export function normalizeColumnValue(v: PossiblyAsync<ColumnValue>): Observable<Value> {
    return getPossiblyAsyncObservable(v).pipe(
        map((value) => (typeof value === 'object' ? value : { value })),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
}

export function normalizeColumns<T extends object>(columns: Column2<T>[]): NormalizedColumn2<T>[] {
    return columns.map((c) => ({
        field: c.field,
        header: normalizeColumnValue(c.header ?? startCase(c.field)),
        cell: (v, ...args) =>
            c.cell
                ? normalizeColumnValue(normalizePossiblyFn(c.cell)(v, ...args))
                : of({ value: get(v, c.field) } satisfies Value),
    }));
}
