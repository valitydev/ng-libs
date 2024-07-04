import isNil from 'lodash-es/isNil';

import { Value } from '../types/value';

import { currencyAmountValueToString } from './currency-amount-value-to-string';
import { datetimeValueToString } from './datetime-value-to-string';

export function valueToString(value?: Value | null): string {
    switch (value?.type) {
        case 'currency':
            return currencyAmountValueToString(value);
        case 'datetime':
            return datetimeValueToString(value);
    }
    return isNil(value?.value) ? '' : String(value?.value);
}
