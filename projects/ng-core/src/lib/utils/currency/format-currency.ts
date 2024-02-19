import { formatCurrency as ngFormatCurrency, getCurrencySymbol } from '@angular/common';

import { getCurrencyExponent } from './get-currency-exponent';
import { toMajorByExponent } from './to-major';

export function formatCurrency(
    amount: number,
    currencyCode: string = 'USD',
    format: 'short' | 'long' = 'long',
    locale = 'en-GB',
    exponent: number = getCurrencyExponent(currencyCode),
): string {
    return ngFormatCurrency(
        toMajorByExponent(amount, exponent),
        locale,
        getCurrencySymbol(currencyCode, 'narrow', locale),
        currencyCode,
        format === 'short' ? `0.0-${exponent}` : undefined,
    );
}
