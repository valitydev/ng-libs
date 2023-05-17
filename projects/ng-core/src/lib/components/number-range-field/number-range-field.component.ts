import { Component, Input } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

import { ValidatedControlSuperclass, createControlProviders } from '../../utils';

export type NumberRange = {
    start?: number;
    end?: number;
};

@Component({
    selector: 'v-number-range-field',
    templateUrl: './number-range-field.component.html',
    styleUrls: ['./number-range-field.component.scss'],
    providers: createControlProviders(() => NumberRangeFieldComponent),
})
export class NumberRangeFieldComponent extends ValidatedControlSuperclass<NumberRange> {
    @Input() label!: string;

    control = this.fb.group<NumberRange>({
        start: undefined,
        end: undefined,
    });

    constructor(private fb: NonNullableFormBuilder) {
        super();
    }
}
