import { Observable, of } from 'rxjs';

import { PossiblyAsync, isAsync } from './is-async';

export function getPossiblyAsyncObservable<T>(possiblyAsync: PossiblyAsync<T>): Observable<T> {
    return isAsync(possiblyAsync) ? possiblyAsync : of(possiblyAsync);
}
