import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

import { ValidatedControlSuperclass, createControlProviders } from '../../utils';

export interface DateRange {
    start?: Date;
    end?: Date;
}

@Component({
    selector: 'v-date-range-field',
    templateUrl: './date-range-field.component.html',
    styleUrls: ['./date-range-field.component.scss'],
    providers: createControlProviders(() => DateRangeFieldComponent),
})
export class DateRangeFieldComponent extends ValidatedControlSuperclass<DateRange> {
    control = this.fb.group({
        start: undefined,
        end: undefined,
    });

    constructor(private fb: NonNullableFormBuilder) {
        super();
    }
}
