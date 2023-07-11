import { booleanAttribute, Component, Input } from '@angular/core';

import { createControlProviders, FormControlSuperclass } from '../../utils';

import { Option } from './types/option';

@Component({
    selector: 'v-select-field',
    templateUrl: './select-field.component.html',
    styleUrls: ['./select-field.component.scss'],
    providers: createControlProviders(() => SelectFieldComponent),
})
export class SelectFieldComponent<T> extends FormControlSuperclass<T> {
    @Input() options: Option<T>[] = [];

    @Input() label?: string;
    @Input() hint?: string;
    @Input() error?: string;

    @Input({ transform: booleanAttribute }) multiple = false;
    @Input({ transform: booleanAttribute }) required = false;
}
