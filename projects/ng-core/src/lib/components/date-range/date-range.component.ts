import { Component } from '@angular/core';
import { NonNullableFormBuilder, ValidationErrors } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';

import { createControlProviders, ValidatedControlSuperclass } from '../../utils';

@Component({
    selector: 'v-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.scss'],
    providers: createControlProviders(() => DateRangeComponent),
})
export class DateRangeComponent extends ValidatedControlSuperclass<DateRange<Date>> {
    control = this.fb.group({
        start: undefined,
        end: undefined,
    });

    constructor(private fb: NonNullableFormBuilder) {
        super();
    }

    override validate(): ValidationErrors | null {
        return (
            super.validate() ??
            (!this.control.value.start || !this.control.value.end
                ? { oneOfTheDatesIsEmpty: true }
                : null)
        );
    }
}
