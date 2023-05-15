import {
    shareReplay,
    Observable,
    defer,
    mergeScan,
    map,
    BehaviorSubject,
    ReplaySubject,
    skipWhile,
} from 'rxjs';

import { inProgressFrom, progressTo } from '../../utils';

export interface Action<TParams> {
    type: 'load' | 'more';
    params?: TParams;
    size?: number;
}

export interface FetchResult<TResultItem, TContinuationToken = string> {
    result: TResultItem[];
    continuationToken?: TContinuationToken;
}

export interface FetchOptions<TContinuationToken = string> {
    size: number;
    continuationToken?: TContinuationToken;
}

export interface Accumulator<TResultItem, TParams, TContinuationToken> {
    result: TResultItem[];
    size: number;
    params?: TParams;
    continuationToken?: TContinuationToken;
}

export abstract class FetchSuperclass<TResultItem, TParams = void, TContinuationToken = string> {
    result$: Observable<TResultItem[]> = defer(() =>
        this.fetch$.pipe(skipWhile((r) => r.type !== 'load'))
    ).pipe(
        mergeScan<Action<TParams>, Accumulator<TResultItem, TParams, TContinuationToken>>(
            (acc, action) => {
                const params = (action.params ?? acc.params) as TParams;
                const size = action.size ?? acc.size;
                return this.fetch(params, {
                    size: size ?? acc.size,
                    continuationToken: acc.continuationToken,
                }).pipe(
                    map(({ result, continuationToken }) => ({
                        params,
                        result:
                            action.type === 'load' ? result : [...(acc.result ?? []), ...result],
                        size,
                        continuationToken,
                    })),
                    progressTo(this.progress$)
                );
            },
            {
                size: 25,
                result: [],
            },
            1
        ),
        map((acc) => acc.result),
        shareReplay({ bufferSize: 1, refCount: true })
    );
    isLoading$ = inProgressFrom(() => this.progress$, this.result$);

    private fetch$ = new ReplaySubject<Action<TParams>>(1);
    private progress$ = new BehaviorSubject(0);

    load(params: TParams, options: { size?: number } = {}): void {
        this.fetch$.next({ type: 'load', params, size: options.size });
    }

    more(): void {
        this.fetch$.next({ type: 'more' });
    }

    protected abstract fetch(
        params: TParams,
        options: FetchOptions<TContinuationToken>
    ): Observable<FetchResult<TResultItem, TContinuationToken>>;
}
