import { Component } from '@angular/core';
import { get } from 'lodash-es';

import { CellTemplateDirective, TemplateColumn } from './cell-template.directive';
import { Column } from '../../types/column';
import { createGridColumn } from '../../utils/create-grid-columns';

export type TooltipColumn<T> = TemplateColumn<
    T,
    'tooltip',
    {
        tooltip: string | ((data: T) => string);
    }
>;

@Component({
    selector: 'v-table-tooltip-cell-template',
    template: `
        <ng-template #tpl let-col="colDef" let-index="index" let-row>
            <div
                [matTooltip]="getTooltip(col, row) || {} | json"
                [ngClass]="{ dashed: !!getTooltip(col, row) }"
                matTooltipPosition="right"
            >
                {{ getValue(col, row) }}
            </div>
        </ng-template>
    `,
    styles: [
        `
            .dashed {
                text-decoration: underline;
                cursor: default;
                text-decoration-style: dotted;
            }
        `,
    ],
})
export class TableTooltipCellTemplateComponent<T> extends CellTemplateDirective<
    T,
    TooltipColumn<T>
> {
    getTooltip(col: TooltipColumn<T>, row: T) {
        return typeof col.data?.tooltip === 'function'
            ? col.data.tooltip(row)
            : get(row, col.data.tooltip);
    }
}

export function createTooltipColumn<T>(
    column: Column<T>,
    tooltip: TooltipColumn<T>['data']['tooltip']
): TooltipColumn<T> {
    const extCol = createGridColumn(column) as Omit<TooltipColumn<T>, 'type'>;
    return {
        type: 'tooltip',
        ...extCol,
        data: {
            ...(extCol?.data || {}),
            tooltip,
        },
    };
}
