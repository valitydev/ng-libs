import { Component, input, computed, Inject, LOCALE_ID } from '@angular/core';

import { formatCurrency } from '../../../utils';
import { TypedParamsValue } from '../types/base-type';

export type CurrencyAmountValue = TypedParamsValue<
    'currency',
    { code: string; exponent?: number; major?: boolean },
    Parameters<typeof formatCurrency>[0]
>;

@Component({
    selector: 'v-currency-amount-value',
    standalone: true,
    template: ` @if (formattedValue(); as f) {
        {{ f }}
    }`,
    styles: ``,
})
export class CurrencyAmountValueComponent {
    value = input.required<CurrencyAmountValue>();

    formattedValue = computed(() => {
        const v = this.value();
        return formatCurrency(
            v.value,
            v.params.code,
            'long',
            this._locale,
            v.params.exponent,
            !!v.params.major,
        );
    });

    constructor(@Inject(LOCALE_ID) private _locale: string) {}
}
