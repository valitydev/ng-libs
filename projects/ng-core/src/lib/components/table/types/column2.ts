import { get } from 'lodash-es';
import startCase from 'lodash-es/startCase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PossiblyAsync, getPossiblyAsyncObservable } from '../../../utils';
import { Value } from '../../value';

type Fn<R, P extends Array<unknown> = []> = (...args: P) => R;
type PossiblyFn<R, P extends Array<unknown> = []> = Fn<R, P> | R;

export type CellFnArgs<T extends object> = [data: T, index: number];

interface ColumnParams {
    sticky?: 'start' | 'end';
    style?: Record<string, unknown>;
}

type CellValue = 'string' | Value | Value[];

export interface Column2<T extends object> extends ColumnParams {
    field: string;
    header?: PossiblyAsync<Partial<Value> | string>;
    cell?: PossiblyFn<PossiblyAsync<CellValue>, CellFnArgs<T>>;
}

export function normalizePossiblyFn<R, P extends Array<unknown>>(fn: PossiblyFn<R, P>): Fn<R, P> {
    return typeof fn === 'function' ? (fn as Fn<R, P>) : () => fn;
}

export class NormColumn<T extends object> {
    field!: string;
    header!: Observable<Value>;
    cell!: Fn<Observable<Value[]>, CellFnArgs<T>>;
    params!: ColumnParams;

    constructor({ field, header, cell, ...params }: Column2<T>, commonParams: ColumnParams = {}) {
        this.field = field ?? (typeof header === 'string' ? header : Math.random());
        const defaultHeaderValue = startCase(field ?? '');
        this.header = getPossiblyAsyncObservable(header).pipe(
            map((value) =>
                typeof value === 'object'
                    ? ({ value: defaultHeaderValue, ...value } as Value)
                    : { value: value ?? defaultHeaderValue },
            ),
        );
        const cellFn = normalizePossiblyFn(cell);
        this.cell = (...args) =>
            getPossiblyAsyncObservable(cellFn(...args)).pipe(
                map((value) => {
                    const defaultValue = get(args[0], this.field);
                    return (Array.isArray(value) ? value : [value ?? defaultValue]).map((v) =>
                        typeof value === 'object'
                            ? ({ value: defaultValue, ...v } as Value)
                            : { value: v ?? defaultValue },
                    );
                }),
            );
        this.params = {
            ...commonParams,
            ...params,
            style: Object.assign({}, commonParams?.style, params?.style),
        };
    }
}
