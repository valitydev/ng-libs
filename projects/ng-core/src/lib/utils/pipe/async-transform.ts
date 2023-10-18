import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Inject, Injectable, OnDestroy, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { isAsync, PossiblyAsync } from './is-async';

@Injectable()
export abstract class AsyncTransform<T = unknown> implements OnDestroy, PipeTransform {
    private asyncPipe?: AsyncPipe;
    private cdr = Inject(ChangeDetectorRef);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform(value: any, ...args: any[]): any {
        return this.asyncTransform(this.getValue(value, ...args));
    }

    ngOnDestroy() {
        this.asyncPipe?.ngOnDestroy?.();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected getValue(value: any, ..._args: any[]): Observable<T> {
        return value;
    }

    protected asyncTransform(value: PossiblyAsync<T>) {
        if (!isAsync(value)) {
            return value;
        }
        if (!this.asyncPipe) {
            this.asyncPipe = new AsyncPipe(this.cdr);
        }
        return this.asyncPipe.transform(value);
    }
}
