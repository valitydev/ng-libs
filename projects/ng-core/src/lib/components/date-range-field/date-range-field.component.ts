import { Component, Input } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { coerceBoolean } from 'coerce-property';

import { FormGroupSuperclass, createControlProviders } from '../../utils';

import { DateRange } from './types/date-range';

@Component({
    selector: 'v-date-range-field',
    templateUrl: './date-range-field.component.html',
    styleUrls: ['./date-range-field.component.scss'],
    providers: [
        ...createControlProviders(() => DateRangeFieldComponent),
        { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] },
    ],
})
export class DateRangeFieldComponent extends FormGroupSuperclass<Partial<DateRange>> {
    @Input() @coerceBoolean required: boolean | '' = false;

    control = this.fb.group<Partial<DateRange>>({
        start: undefined,
        end: undefined,
    });

    constructor(private fb: NonNullableFormBuilder) {
        super();
    }
}
