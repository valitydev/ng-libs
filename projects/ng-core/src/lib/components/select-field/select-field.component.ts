import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';

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

    @Input() label?: string;
    @Input() hint?: string;
    @Input() error?: string;
    @Input() progress = false;

    @Input({ transform: booleanAttribute }) externalSearch = false;
    @Input({ transform: booleanAttribute }) multiple = false;
    @Input({ transform: booleanAttribute }) required = false;

    searchStr: string = '';

    search = (term: string, item: Option<T>) => {
        if (this.externalSearch) return true;
        const termLowerCase = term.toLowerCase();
        return (
            item.label.toLowerCase().includes(termLowerCase) ||
            !!item.description?.includes?.(termLowerCase)
        );
    };
}
