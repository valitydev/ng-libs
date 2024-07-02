import { CommonModule } from '@angular/common';
import { Component, input, computed, signal, output, booleanAttribute } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ContentLoadingComponent } from '../content-loading';
import { TagModule } from '../tag';

import { CurrencyAmountValueComponent } from './components/currency-amount-value.component';
import { DatetimeValueComponent } from './components/datetime-value.component';
import { MenuValueComponent } from './components/menu-value.component';
import { Value } from './types/value';

@Component({
    selector: 'v-value',
    standalone: true,
    imports: [
        CommonModule,
        MatIcon,
        MatIconButton,
        TagModule,
        MatTooltip,
        DatetimeValueComponent,
        CurrencyAmountValueComponent,
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
    progress = input(false, { transform: booleanAttribute });
    inline = input(false, { transform: booleanAttribute });
    lazyVisibleChange = output<boolean>();

    lazyVisible = signal(false);
    isLoaded = computed(() => !this.value()?.lazy || this.lazyVisible());

    toggleLazyVisible() {
        this.lazyVisible.set(true);
        this.lazyVisibleChange.emit(this.lazyVisible());
    }
}
