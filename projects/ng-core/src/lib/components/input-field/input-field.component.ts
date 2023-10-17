import { Component, Input } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { createControlProviders, FormControlSuperclass } from '../../utils';

@Component({
    selector: 'v-input-field',
    templateUrl: './input-field.component.html',
    providers: createControlProviders(() => InputFieldComponent),
})
export class InputFieldComponent<T> extends FormControlSuperclass<T> {
    @Input() label?: string;
    @Input() type: 'string' | 'number' = 'string';
    @Input() appearance: MatFormFieldAppearance = 'fill';
}
