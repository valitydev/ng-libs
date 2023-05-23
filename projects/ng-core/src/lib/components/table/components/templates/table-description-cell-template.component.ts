import { Component } from '@angular/core';
import { get } from 'lodash-es';

import { CellTemplateDirective, TemplateColumn } from './cell-template.directive';
import { Column } from '../../types/column';
import { createGridColumn } from '../../utils/create-grid-columns';

export type DescriptionColumn<T> = TemplateColumn<
    T,
    'description',
    {
        description: string | ((data: T) => string);
    }
>;

@Component({
    selector: 'v-table-description-cell-template',
    template: `
        <ng-template let-col="colDef" let-index="index" let-row>
            <div class="v-table-description-cell-template">
                {{ getValue(col, row) }}
                <div class="mat-caption description">
                    {{ getDescription(col, row) }}
                </div>
            </div>
        </ng-template>
    `,
})
export class TableDescriptionCellTemplateComponent<T> extends CellTemplateDirective<
    T,
    DescriptionColumn<T>
> {
    getDescription(col: DescriptionColumn<T>, row: T) {
        return typeof col.data.description === 'function'
            ? col.data.description(row)
            : get(row, col.data.description);
    }
}

export function createDescriptionColumn<T>(
    column: Column<T>,
    description: DescriptionColumn<T>['data']['description']
): DescriptionColumn<T> {
    const descColumn = createGridColumn(column) as Omit<DescriptionColumn<T>, 'type'>;
    return {
        type: 'description',
        ...descColumn,
        header: typeof column === 'string' ? '' : descColumn.header,
        data: {
            ...(descColumn.data || {}),
            description,
        },
    };
}
