import { formatDate } from '@angular/common';
import { Component, input, computed, Inject, LOCALE_ID } from '@angular/core';
import isNil from 'lodash-es/isNil';

import { TypedValue } from '../types/base-type';

export type DatetimeValue = TypedValue<'datetime', Parameters<typeof formatDate>[0]>;

@Component({
    selector: 'v-datetime-value',
    standalone: true,
    template: ` @if (formattedValue(); as f) {
        {{ f }}
    }`,
    styles: ``,
})
export class DatetimeValueComponent {
    value = input.required<DatetimeValue>();

    formattedValue = computed(() => {
        const value = this.value()?.value;
        return isNil(value) ? '' : formatDate(value, 'dd.MM.yyyy HH:mm:ss', this._locale, '+0000');
    });

    constructor(@Inject(LOCALE_ID) private _locale: string) {}
}
