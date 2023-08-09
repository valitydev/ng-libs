import { get as _get } from 'lodash-es';
import { isObservable, Observable, of } from 'rxjs';

export type SelectFn<TObject extends object = object, TResult = unknown, TParams = void> =
    | string
    | ((obj: TObject, ...params: TParams[]) => Observable<TResult> | TResult);

export function select<TObject extends object, TResult, TParams = void>(
    obj: TObject,
    selectFn: SelectFn<TObject, TResult, TParams>,
    defaultValue?: TResult,
    restParams: TParams[] = [],
): TResult | Observable<TResult> {
    if (typeof selectFn === 'string') return _get(obj, selectFn, defaultValue) as TResult;
    return selectFn(obj, ...restParams);
}

export function selectAsObservable<TObject extends object, TResult, TParams = void>(
    obj: TObject,
    selectFn: SelectFn<TObject, TResult, TParams>,
    defaultValue?: TResult,
    restParams: TParams[] = [],
): TResult | Observable<TResult> {
    const res = select(obj, selectFn, defaultValue, restParams);
    return isObservable(res) ? res : of(res);
}
