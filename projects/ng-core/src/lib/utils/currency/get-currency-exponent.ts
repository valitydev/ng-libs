import * as Currencies from '@dinero.js/currencies';

export const getCurrencyExponent = (currencyCode: string): number =>
    Currencies[currencyCode as keyof typeof Currencies]?.exponent;
