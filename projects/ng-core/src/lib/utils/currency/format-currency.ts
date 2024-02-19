import { formatCurrency as ngFormatCurrency, getCurrencySymbol } from '@angular/common';

import { getCurrencyExponent } from './get-currency-exponent';
import { toMajorByExponent } from './to-major';

export function formatCurrency(
    amount: number,
    currencyCode: string = 'USD',
    format: 'short' | 'long' = 'long',
    locale = 'en-GB',
    exponent: number = getCurrencyExponent(currencyCode),
    isMajor: boolean = false,
): string {
    return ngFormatCurrency(
        isMajor ? amount : toMajorByExponent(amount, exponent),
        locale,
        getCurrencySymbol(currencyCode, 'narrow', locale),
        currencyCode,
        format === 'short' ? `1.0-${exponent}` : `1.${exponent}-${exponent}`,
    );
}
