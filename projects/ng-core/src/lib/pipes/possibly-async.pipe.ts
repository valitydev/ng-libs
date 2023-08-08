import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { isObservable, Observable } from 'rxjs';

export type Async<T> = Observable<T>;
export type PossiblyAsync<T> = Async<T> | T;

export function isAsync<T>(value: PossiblyAsync<T>): value is Async<T> {
    return isObservable(value);
}

@Pipe({
    standalone: true,
    name: 'vPossiblyAsync',
    pure: false,
})
export class VPossiblyAsyncPipe<T> implements PipeTransform, OnDestroy {
    private asyncPipe?: AsyncPipe;

    constructor(private ref: ChangeDetectorRef) {}

    transform(value: PossiblyAsync<T>): T | null {
        if (!isAsync(value)) return value;
        if (!this.asyncPipe) this.asyncPipe = new AsyncPipe(this.ref);
        return this.asyncPipe.transform(value);
    }

    ngOnDestroy() {
        this.asyncPipe?.ngOnDestroy?.();
    }
}
