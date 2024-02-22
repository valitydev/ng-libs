import { PossiblyAsync } from '../../../utils';
import { Value } from '../../value';

type PossiblyFn<R, P extends Array<unknown> = []> = ((...args: P) => R) | R;

export type Cell<T extends object> = PossiblyFn<
    PossiblyAsync<Value | string>,
    [data: T, index: number]
>;

export interface Column2<T extends object> {
    field: string;
    header?: PossiblyAsync<Value | string>;
    cell?: Cell<T>;
}
