import { getCurrencyExponent } from './get-currency-exponent';

export const toMinor = (amount: number, currencyCode: string): number =>
    Math.round(amount * 10 ** getCurrencyExponent(currencyCode));
