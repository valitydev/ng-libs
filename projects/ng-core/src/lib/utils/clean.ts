import isObject from 'lodash-es/isObject';
import { ValuesType } from 'utility-types';

import { isEmpty } from './is-empty';
import { isEmptyPrimitive } from './is-empty-primitive';

export function clean<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>,
    TAllowRootRemoval extends boolean = false
>(
    obj: T,
    allowRootRemoval: TAllowRootRemoval = false as TAllowRootRemoval,
    isNotDeep = false,
    filterPredicate: (v: unknown, k?: PropertyKey) => boolean = (v) => !isEmpty(v)
): TAllowRootRemoval extends true ? T | null : T {
    let result: unknown;
    const cleanChild = (v: unknown) =>
        isNotDeep ? v : clean(v as never, allowRootRemoval, isNotDeep, filterPredicate);
    if (Array.isArray(obj)) {
        result = (obj as ValuesType<T>[])
            .map((v) => cleanChild(v))
            .filter((v, idx) => filterPredicate(v, idx));
    } else if (isObject(obj)) {
        result = Object.fromEntries(
            (Object.entries(obj) as [keyof T, ValuesType<T>][])
                .map(([k, v]) => [k, cleanChild(v)] as const)
                .filter(([k, v]) => filterPredicate(v, k))
        );
    } else {
        result = obj;
    }
    return allowRootRemoval && !filterPredicate(result) ? (null as never) : (result as never);
}

export function cleanPrimitiveProps<T extends object>(
    obj: T,
    allowRootRemoval = false,
    isNotDeep = false
) {
    return clean(obj, allowRootRemoval, isNotDeep, (v) => !isEmptyPrimitive(v));
}
