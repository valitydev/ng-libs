import { combineLatest, mergeMap, EMPTY, merge } from 'rxjs';
import { map, delay, shareReplay } from 'rxjs/operators';

import { getObservable, ObservableOrFn } from './get-observable';

export function inProgressFrom(
    progress: ObservableOrFn<number | boolean> | ObservableOrFn<number | boolean>[],
    main?: ObservableOrFn,
) {
    const progresses = (Array.isArray(progress) ? progress : [progress]).map((p) =>
        getObservable(p),
    );
    return merge(
        combineLatest(progresses),
        main ? getObservable(main).pipe(mergeMap(() => EMPTY)) : EMPTY,
    ).pipe(
        map((ps) => ps.some((p) => !!p)),
        // make async to bypass angular detect changes
        delay(0),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
}
