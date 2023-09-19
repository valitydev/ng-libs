import { isObservable, Observable } from 'rxjs';

export type Async<T> = Observable<T>;
export type PossiblyAsync<T> = Async<T> | T;

export function isAsync<T>(value: PossiblyAsync<T>): value is Async<T> {
    return isObservable(value);
}
