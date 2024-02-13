import { formatCurrency as ngFormatCurrency, getCurrencySymbol } from '@angular/common';
import isNil from 'lodash-es/isNil';

import { getCurrencyExponent } from './get-currency-exponent';
import { toMajor, toMajorByExponent } from './to-major';

export function formatCurrency(
    amount: number,
    currencyCode: string = 'USD',
    format: 'short' | 'long' = 'long',
    locale = 'en-GB',
    exponent?: number,
): string {
    return ngFormatCurrency(
        isNil(exponent) ? toMajor(amount, currencyCode) : toMajorByExponent(amount, exponent),
        locale,
        getCurrencySymbol(currencyCode, 'narrow', locale),
        currencyCode,
        format === 'short' ? `0.0-${exponent ?? getCurrencyExponent(currencyCode)}` : undefined,
    );
}
