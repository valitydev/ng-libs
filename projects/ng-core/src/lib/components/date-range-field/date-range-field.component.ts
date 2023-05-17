import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { WrappedControlSuperclass } from '@s-libs/ng-core';

import { provideValueAccessor } from '../../utils';

export interface DateRange {
    start?: Date;
    end?: Date;
}

@Component({
    selector: 'v-date-range-field',
    templateUrl: './date-range-field.component.html',
    styleUrls: ['./date-range-field.component.scss'],
    providers: [provideValueAccessor(() => DateRangeFieldComponent)],
})
export class DateRangeFieldComponent extends WrappedControlSuperclass<DateRange> {
    control = this.fb.group({
        start: undefined,
        end: undefined,
    });

    constructor(private fb: NonNullableFormBuilder) {
        super();
    }
}
