import { Component } from '@angular/core';
import { get } from 'lodash-es';

import { CellTemplateDirective, TemplateColumn } from './cell-template.directive';
import { Column } from '../../types/column';
import { createGridColumn } from '../../utils/create-grid-columns';

export type CurrencyColumn<T> = TemplateColumn<
    T,
    'currency',
    {
        currencyField: string | ((data: T) => string);
    }
>;

@Component({
    selector: 'v-table-currency-cell-template',
    template: `
        <ng-template let-col="colDef" let-index="index" let-row>
            {{ getValue(col, row) | amountCurrency : getCurrency(col, row) }}
        </ng-template>
    `,
})
export class TableCurrencyCellTemplateComponent<T> extends CellTemplateDirective<
    T,
    CurrencyColumn<T>
> {
    getCurrency(col: CurrencyColumn<T>, row: T): string {
        return typeof col.data.currencyField === 'function'
            ? col.data.currencyField(row)
            : get(row, col.data.currencyField);
    }
}

export function createCurrencyColumn<T>(
    column: Column<T>,
    currencyField: CurrencyColumn<T>['data']['currencyField']
): CurrencyColumn<T> {
    const extColumn = createGridColumn(column) as Omit<CurrencyColumn<T>, 'type'>;
    return {
        type: 'currency',
        ...extColumn,
        data: {
            ...(extColumn.data || {}),
            currencyField,
        },
    };
}
