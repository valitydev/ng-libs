import { CurrencyAmountValue } from '../components/currency-amount-value.component';
import { DatetimeValue } from '../components/datetime-value.component';
import { MenuValue } from '../components/menu-value.component';

import { BaseValue } from './base-type';

type TypedBaseValue = BaseValue & { type?: never };
export type Value = TypedBaseValue | DatetimeValue | MenuValue | CurrencyAmountValue;
