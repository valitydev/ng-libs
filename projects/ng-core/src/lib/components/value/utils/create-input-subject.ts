import { BehaviorSubject } from 'rxjs';

export function createInputSubject<T extends Record<P, V>, P extends string, V>(
    target: T,
    propertyKey: P,
    _initValue: V,
): BehaviorSubject<V> {
    const sub$ = new BehaviorSubject<unknown>(target[propertyKey]);
    Object.defineProperty(target, propertyKey, {
        get: function () {
            return sub$.value;
        },
        set: function (v) {
            sub$.next(v);
        },
    });
    return sub$ as never;
}
