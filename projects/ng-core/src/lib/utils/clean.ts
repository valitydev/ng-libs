import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import { ValuesType } from 'utility-types';

function isEmptyPrimitive(value: unknown): boolean {
    return isNil(value) || value === '';
}

function isEmptyObjectOrPrimitive(value: unknown): boolean {
    return isObject(value) ? isEmpty(value) : isEmptyPrimitive(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clean<
    T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>,
    TAllowRootRemoval extends boolean = false
>(
    value: T,
    allowRootRemoval: TAllowRootRemoval = false as TAllowRootRemoval,
    isNotDeep = false,
    filterPredicate: (v: unknown, k?: PropertyKey) => boolean = (v) => !isEmptyObjectOrPrimitive(v)
): TAllowRootRemoval extends true ? T | null : T {
    if (!isObject(value) || (value.constructor !== Object && !Array.isArray(value))) return value;
    if (allowRootRemoval && !filterPredicate(value as never)) return null as never;
    let result: unknown;
    const cleanChild = (v: unknown) =>
        isNotDeep ? v : clean(v as never, allowRootRemoval, isNotDeep, filterPredicate);
    if (Array.isArray(value))
        result = (value as ValuesType<T>[])
            .slice()
            .map((v) => cleanChild(v))
            .filter((v, idx) => filterPredicate(v, idx));
    else
        result = Object.fromEntries(
            (Object.entries(value) as [keyof T, ValuesType<T>][])
                .map(([k, v]) => [k, cleanChild(v)] as const)
                .filter(([k, v]) => filterPredicate(v, k))
        );
    return allowRootRemoval && !filterPredicate(result) ? (null as never) : (result as never);
}

export function cleanPrimitiveProps<T extends object>(
    obj: T,
    allowRootRemoval = false,
    isNotDeep = false
) {
    return clean(obj, allowRootRemoval, isNotDeep, (v) => !isEmptyPrimitive(v));
}
