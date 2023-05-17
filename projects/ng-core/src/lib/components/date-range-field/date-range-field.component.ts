import { Component } from '@angular/core';
import { NonNullableFormBuilder, ValidationErrors } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';

import { createControlProviders, ValidatedControlSuperclass } from '../../utils';

@Component({
    selector: 'v-date-range-field',
    templateUrl: './date-range-field.component.html',
    styleUrls: ['./date-range-field.component.scss'],
    providers: createControlProviders(() => DateRangeFieldComponent),
})
export class DateRangeFieldComponent extends ValidatedControlSuperclass<DateRange<Date>> {
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
