import { formatCurrency as ngFormatCurrency, getCurrencySymbol } from '@angular/common';

import { toMajor } from './to-major';

export function formatCurrency(
    amount: number,
    currencyCode: string = 'USD',
    format: 'short' | 'long' = 'long',
    locale = 'en-GB'
): string {
    return ngFormatCurrency(
        toMajor(amount, currencyCode),
        locale,
        getCurrencySymbol(currencyCode, 'narrow', locale),
        currencyCode,
        format === 'short' ? '0.0-2' : undefined
    );
}
