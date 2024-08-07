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
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

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
})
export class ValueComponent {
    value = input<Value | null>();
    resultingValue = input<string>();
    progress = input(false, { transform: booleanAttribute });
    inline = input(false, { transform: booleanAttribute });
    emptySymbol = input(undefined, {
        transform: (v) => (v === true || v === '' ? '―' : typeof v === 'string' ? v : ''),
    });

    lazyVisibleChange = output<boolean>();

    lazyVisible = signal(false);
    isLoaded = computed(() => !this.value()?.lazy || this.lazyVisible());
    renderedValue = computed(
        () =>
            this.resultingValue() ??
            runInInjectionContext(this.injector, () => valueToString(this.value())),
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
