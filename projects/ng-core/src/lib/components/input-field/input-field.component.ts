import { Component, Input } from '@angular/core';

import { createControlProviders, FormControlSuperclass } from '../../utils';

@Component({
    selector: 'v-input-field',
    templateUrl: './input-field.component.html',
    providers: createControlProviders(() => InputFieldComponent),
})
export class InputFieldComponent<T> extends FormControlSuperclass<T> {
    @Input() label?: string;
    @Input() type: 'string' | 'number' = 'string';
}
