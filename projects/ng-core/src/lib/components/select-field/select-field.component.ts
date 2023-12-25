import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { createControlProviders, FormControlSuperclass } from '../../utils';

import { Option } from './types/option';

@Component({
    selector: 'v-select-field',
    templateUrl: './select-field.component.html',
    styleUrls: ['./select-field.component.scss'],
    providers: createControlProviders(() => SelectFieldComponent),
})
export class SelectFieldComponent<T> extends FormControlSuperclass<T[]> {
    @Input() options: Option<T>[] = [];
    @Output() searchChange = new EventEmitter<string>();

    @Input() appearance: MatFormFieldAppearance = 'fill';

    @Input() label?: string;
    @Input() hint?: string;
    @Input() error?: string;
    @Input() progress = false;

    @Input({ transform: booleanAttribute }) externalSearch = false;
    @Input({ transform: booleanAttribute }) multiple = false;
    @Input({ transform: booleanAttribute }) required = false;

    searchStr: string = '';

    get option() {
        return this.options?.find?.((o) => o.value === this.control.value);
    }

    get hintText() {
        if (this.hint) {
            return this.hint;
        }
        if (this.multiple && this.options && this.options.length > 1) {
            return (this.control.value?.length || 0) + '/' + this.options.length;
        }
        return this.option?.description;
    }

    search = (term: string, item: Option<T>) => {
        if (this.externalSearch) {
            return true;
        }
        const termLowerCase = term.toLowerCase();
        return (
            item.label.toLowerCase().includes(termLowerCase) ||
            !!item.description?.includes?.(termLowerCase)
        );
    };
}
