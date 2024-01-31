import { combineLatest, mergeMap, EMPTY } from 'rxjs';
import { map, delay, shareReplay } from 'rxjs/operators';

import { getObservable, ObservableOrFn } from './get-observable';

export function inProgressFrom(
    progress: ObservableOrFn<number | boolean> | ObservableOrFn<number | boolean>[],
    main?: ObservableOrFn,
) {
    const progresses = (Array.isArray(progress) ? progress : [progress]).map((p) =>
        getObservable(p),
    );
    if (main) {
        progresses.push(getObservable(main).pipe(mergeMap(() => EMPTY)));
    }
    return combineLatest(progresses).pipe(
        map((ps) => ps.some((p) => !!p)),
        // make async to bypass angular detect changes
        delay(0),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
}
