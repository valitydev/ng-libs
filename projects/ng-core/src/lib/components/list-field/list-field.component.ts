import { Component, Input } from '@angular/core';

import { createControlProviders, FormControlSuperclass, splitBySeparators } from '../../utils';

@Component({
    selector: 'v-list-field',
    templateUrl: './list-field.component.html',
    providers: createControlProviders(() => ListFieldComponent),
})
export class ListFieldComponent extends FormControlSuperclass<string[], string> {
    @Input() label?: string;

    protected override innerToOuterValue(inner: string): string[] {
        return splitBySeparators(inner || '');
    }

    protected override outerToInnerValue(outer: string[]): string {
        return (outer || []).join(', ');
    }
}
