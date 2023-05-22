import round from 'lodash-es/round';

import { getCurrencyExponent } from './get-currency-exponent';

export const toMajor = (amount: number, currencyCode: string): number =>
    round(amount / 10 ** getCurrencyExponent(currencyCode), getCurrencyExponent(currencyCode));
