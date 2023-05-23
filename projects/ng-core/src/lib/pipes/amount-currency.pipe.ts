import { Pipe, PipeTransform, Inject, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { formatCurrency } from '../utils';

@Pipe({
    standalone: true,
    name: 'amountCurrency',
})
export class AmountCurrencyPipe implements PipeTransform {
    constructor(
        @Inject(LOCALE_ID) private _locale: string,
        @Inject(DEFAULT_CURRENCY_CODE) private _defaultCurrencyCode: string = 'USD'
    ) {}

    transform(
        amount: unknown,
        currencyCode: string = this._defaultCurrencyCode,
        format: 'short' | 'long' = 'long'
    ): unknown {
        if (typeof amount === 'number')
            return formatCurrency(amount, currencyCode, format, this._locale);
        return amount;
    }
}
