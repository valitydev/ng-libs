import { booleanAttribute, Component, Input, OnChanges } from '@angular/core';
import { BehaviorSubject, merge, tap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { createControlProviders, FormControlSuperclass, ComponentChanges } from '../../utils';
import { Option } from '../select-field';

@Component({
    selector: 'v-autocomplete-field',
    templateUrl: './autocomplete-field.component.html',
    styleUrls: ['./autocomplete-field.component.scss'],
    providers: createControlProviders(() => AutocompleteFieldComponent),
})
export class AutocompleteFieldComponent<T> extends FormControlSuperclass<T> implements OnChanges {
    @Input() options: Option<T>[] = [];

    @Input() label?: string;
    @Input() hint?: string;
    @Input() error?: string;
    @Input() type = 'text';

    @Input({ transform: booleanAttribute }) mono = false;
    @Input({ transform: booleanAttribute }) required = false;

    options$ = new BehaviorSubject<Option<T>[]>([]);
    selected$ = merge(this.control.valueChanges, this.options$).pipe(
        map(() => (this.options || []).find((o) => o.value === this.control.value)),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    filteredOptions$ = merge(this.control.valueChanges, this.options$).pipe(
        map(() => String(this.control.value ?? '').toLowerCase()),
        tap(console.log),
        map((filter) =>
            (this.options || []).filter(
                (o) =>
                    String(o.value).toLowerCase().includes(filter) ||
                    o.label.toLowerCase().includes(filter) ||
                    o.description?.toLowerCase()?.includes?.(filter),
            ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    override ngOnChanges(changes: ComponentChanges<AutocompleteFieldComponent<T>>) {
        super.ngOnChanges(changes);
        if (changes.options) {
            this.options$.next(this.options || []);
        }
    }
}
