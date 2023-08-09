import { catchError, merge, Observable, of, scan, Subject, takeLast } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { getProgressByCount } from '../../components/progress';

export interface Result<T> {
    index: number;
    hasError: boolean;

    result?: T;
    error?: unknown;
}

export function forkJoinToResult<T>(
    sources: Observable<T>[],
    concurrency = 4,
    progress$?: Subject<number>,
): Observable<Result<T>[]> {
    let completed = 0;
    if (progress$) progress$.next(getProgressByCount(sources.length));
    return merge(
        ...sources.map((source, index) =>
            source.pipe(
                map((result) => ({
                    result,
                    hasError: false,
                    index,
                })),
                catchError((err) => {
                    return of({ error: err, index, hasError: true });
                }),
                finalize(() => {
                    completed += 1;
                    if (progress$) progress$.next(getProgressByCount(sources.length, completed));
                }),
            ),
        ),
        concurrency,
    ).pipe(
        scan((acc, value) => {
            acc.push(value);
            return acc;
        }, [] as Result<T>[]),
        takeLast(1),
        map((r) => r.sort((a, b) => a.index - b.index)),
    );
}