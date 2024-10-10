import { CommonModule } from '@angular/common';
import {
    Component,
    booleanAttribute,
    runInInjectionContext,
    Injector,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { combineLatest, switchMap, of, isObservable, BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { HighlightDirective } from '../../directives';
import { ContentLoadingComponent } from '../content-loading';
import { TagModule } from '../tag';

import { MenuValueComponent } from './components/menu-value.component';
import { Value } from './types/value';
import { createInputSubject } from './utils/create-input-subject';
import { valueToString } from './utils/value-to-string';
import { Router } from '@angular/router';

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
        HighlightDirective,
    ],
    templateUrl: './value.component.html',
    styleUrl: './value.component.scss',
    host: {
        '[class.inline]': 'inline',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueComponent {
    @Input() value: Value | null | undefined = null;
    value$ = createInputSubject(this, 'value', this.value);

    @Input() lazyValue: Observable<Value> | undefined = undefined;
    lazyValue$ = createInputSubject(this, 'lazyValue', this.lazyValue);

    progress = input(false, { transform: booleanAttribute });
    @Input({ transform: booleanAttribute }) inline = false;
    @Input({
        transform: (v: unknown): string => (v === false ? '' : typeof v === 'string' ? v : '―'),
    })
    emptySymbol = '―';

    @Input() highlight?: string | null;

    @Output() lazyVisibleChange = new EventEmitter<boolean>();

    resultingValue$ = of(null);

    lazyVisible = new BehaviorSubject(false);
    isLoaded$ = combineLatest([of(null), this.lazyVisible]).pipe(
        map(([lazyValue, lazyVisible]) => !lazyValue || lazyVisible),
        distinctUntilChanged(),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    resValue$ = combineLatest([this.value$, this.lazyValue$]).pipe(
        switchMap(([value, lazyValue]) => (isObservable(lazyValue) ? lazyValue : of(value))),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    renderedValue$ = combineLatest([this.resultingValue$, this.resValue$]).pipe(
        map(
            ([resultingValue, resValue]) =>
                resultingValue ??
                runInInjectionContext(this.injector, () => valueToString(resValue)),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    inProgress$ = combineLatest([
        toObservable(this.progress),
        this.resValue$.pipe(map((v) => v?.inProgress ?? false)),
    ]).pipe(
        map(([compProgress, valueProgress]) => compProgress || valueProgress),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    constructor(
        private injector: Injector,
        private router: Router,
    ) {}

    toggleLazyVisible() {
        this.lazyVisible.next(true);
        this.lazyVisibleChange.emit(true);
    }

    click(event: MouseEvent) {
        return runInInjectionContext(this.injector, () => {
            if (this.value?.click) {
                return this.value.click(event);
            } else if (typeof this.value?.link === 'function') {
                const linkArgs = this.value.link(event);
                if (typeof linkArgs === 'string') {
                    return this.router.navigateByUrl(linkArgs);
                }
                return this.router.navigate(...linkArgs);
            }
        });
    }
}
