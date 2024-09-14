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
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { combineLatest, switchMap, of, isObservable, BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { ContentLoadingComponent } from '../content-loading';
import { TagModule } from '../tag';

import { MenuValueComponent } from './components/menu-value.component';
import { Value } from './types/value';
import { createInputSubject } from './utils/create-input-subject';
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
        '[class.inline]': 'inline',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueComponent {
    @Input() value: Value | null = null;
    value$ = createInputSubject(this, 'value', this.value);

    @Input() lazyValue: Observable<Value> | undefined = undefined;
    lazyValue$ = createInputSubject(this, 'lazyValue', this.lazyValue);

    @Input({ transform: booleanAttribute }) progress = false;
    @Input({ transform: booleanAttribute }) inline = false;
    @Input({ transform: (v: unknown): string => (typeof v === 'string' ? v : '―') })
    emptySymbol = '―';

    resultingValue$ = of(null);

    @Output() lazyVisibleChange = new EventEmitter<boolean>();

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

    constructor(private injector: Injector) {}

    toggleLazyVisible() {
        this.lazyVisible.next(true);
        this.lazyVisibleChange.emit(true);
    }

    click(event: MouseEvent) {
        runInInjectionContext(this.injector, () => {
            if (this.value?.click) {
                this.value.click(event);
            } else if (typeof this.value?.link === 'function') {
                this.value.link(event);
            }
        });
    }
}
