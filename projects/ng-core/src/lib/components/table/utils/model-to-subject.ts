import {
    inject,
    DestroyRef,
    OutputEmitterRef,
    Injector,
    InputSignalWithTransform,
} from '@angular/core';
import { toObservable, outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject, merge } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export function modelToSubject<T, TransformT>(
    input: InputSignalWithTransform<T, TransformT>,
    output: OutputEmitterRef<T>,
): ReplaySubject<T> {
    const sub$ = new ReplaySubject<T>(1);
    const dr = inject(DestroyRef);
    const injector = inject(Injector);
    merge(toObservable(input, { injector }), outputToObservable(output))
        .pipe(distinctUntilChanged(), takeUntilDestroyed(dr))
        .subscribe((v) => {
            sub$.next(v as T);
        });
    return sub$;
}
