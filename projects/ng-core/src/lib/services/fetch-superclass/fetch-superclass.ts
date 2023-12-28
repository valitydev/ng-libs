import { Observable, defer, mergeScan, map, BehaviorSubject, ReplaySubject, skipWhile } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';

import { inProgressFrom, progressTo } from '../../utils';

export interface Action<TParams> {
    type: 'load' | 'reload' | 'more';
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

export interface LoadOptions {
    size?: number;
}

export interface Accumulator<TResultItem, TParams, TContinuationToken> {
    result: TResultItem[];
    size: number;
    params?: TParams;
    continuationToken?: TContinuationToken;
}

const DEFAULT_SIZE = 25;

export abstract class FetchSuperclass<TResultItem, TParams = void, TContinuationToken = string> {
    result$ = defer(() => this.state$).pipe(map(({ result }) => result));
    hasMore$ = defer(() => this.state$).pipe(map(({ continuationToken }) => !!continuationToken));
    isLoading$ = inProgressFrom(
        () => this.progress$,
        () => this.state$,
    );

    private fetch$ = new ReplaySubject<Action<TParams>>(1);
    private progress$ = new BehaviorSubject(0);
    private state$ = defer(() => this.fetch$.pipe(skipWhile(({ type }) => type !== 'load'))).pipe(
        mergeScan<Action<TParams>, Accumulator<TResultItem, TParams, TContinuationToken>>(
            (acc, action) => {
                const params = (action.type === 'load' ? action.params : acc.params) as TParams;
                const size = action.size ?? acc.size;
                const continuationToken =
                    action.type === 'more' ? acc.continuationToken : undefined;
                return this.fetch(params, { size, continuationToken }).pipe(
                    ...((action.type === 'load'
                        ? ([
                              startWith({
                                  params,
                                  result: [],
                                  size,
                                  continuationToken: undefined,
                              }),
                          ] as unknown)
                        : []) as []),
                    map(({ result, continuationToken }) => ({
                        params,
                        result:
                            action.type === 'load' ? result : [...(acc.result ?? []), ...result],
                        size,
                        continuationToken,
                    })),
                    progressTo(this.progress$),
                );
            },
            {
                size: DEFAULT_SIZE,
                result: [],
            },
            1,
        ),
        shareReplay({ bufferSize: 1, refCount: true }),
    );

    load(params: TParams, options: LoadOptions = {}): void {
        this.fetch$.next({ type: 'load', params, size: options.size });
    }

    reload(options: LoadOptions = {}): void {
        this.fetch$.next({ type: 'reload', size: options.size });
    }

    more(): void {
        this.fetch$.next({ type: 'more' });
    }

    protected abstract fetch(
        params: TParams,
        options: FetchOptions<TContinuationToken>,
    ): Observable<FetchResult<TResultItem, TContinuationToken>>;
}
