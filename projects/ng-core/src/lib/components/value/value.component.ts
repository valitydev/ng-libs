import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    signal,
    output,
    booleanAttribute,
    runInInjectionContext,
    Injector,
    ChangeDetectionStrategy,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable, combineLatest, switchMap, of, isObservable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ContentLoadingComponent } from '../content-loading';
import { TagModule } from '../tag';

import { MenuValueComponent } from './components/menu-value.component';
import { Value } from './types/value';
import { valueToString } from './utils/value-to-string';

@Component({
    selector: 'v-value',
    standalone: true,
    imports: [
        CommonModule,
        MatIcon,
        MatIconButton,
        TagModule,
        MatTooltip,
        MenuValueComponent,
        ContentLoadingComponent,
    ],
    templateUrl: './value.component.html',
    styleUrl: './value.component.scss',
    host: {
        '[class.inline]': 'inline()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueComponent {
    value = input<Value | null>();
    lazyValue = input<Observable<Value> | null>();
    resultingValue = input<string>();
    progress = input(false, { transform: booleanAttribute });
    inline = input(false, { transform: booleanAttribute });
    emptySymbol = input(undefined, {
        transform: (v) => (v === true || v === '' ? '―' : typeof v === 'string' ? v : ''),
    });

    lazyVisibleChange = output<boolean>();

    lazyVisible = signal(false);
    isLoaded = computed(() => !this.lazyValue() || this.lazyVisible());
    resValue$ = combineLatest([toObservable(this.value), toObservable(this.lazyValue)]).pipe(
        switchMap(([value, lazyValue]) => (isObservable(lazyValue) ? lazyValue : of(value))),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    renderedValue$ = combineLatest([toObservable(this.resultingValue), this.resValue$]).pipe(
        map(
            ([resultingValue, resValue]) =>
                resultingValue ??
                runInInjectionContext(this.injector, () => valueToString(resValue)),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    constructor(private injector: Injector) {}

    toggleLazyVisible() {
        this.lazyVisible.set(true);
        this.lazyVisibleChange.emit(this.lazyVisible());
    }

    click(event: MouseEvent) {
        if (this.value()?.click) {
            runInInjectionContext(this.injector, () => {
                this.value()?.click?.(event);
            });
        } else if (typeof this.value()?.link === 'function') {
            runInInjectionContext(this.injector, () => {
                this.value()?.link?.(event);
            });
        }
    }
}
