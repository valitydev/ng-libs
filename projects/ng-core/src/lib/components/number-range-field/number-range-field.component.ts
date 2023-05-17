import { Component, Input } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { provideValueAccessor, WrappedControlSuperclass } from '@s-libs/ng-core';

export type NumberRange = {
    start?: number;
    end?: number;
};

@Component({
    selector: 'v-number-range-field',
    templateUrl: './number-range-field.component.html',
    styleUrls: ['./number-range-field.component.scss'],
    providers: [provideValueAccessor(NumberRangeFieldComponent)],
})
export class NumberRangeFieldComponent extends WrappedControlSuperclass<NumberRange> {
    @Input() label!: string;

    control = this.fb.group<NumberRange>({
        start: undefined,
        end: undefined,
    });

    constructor(private fb: NonNullableFormBuilder) {
        super();
    }
}
