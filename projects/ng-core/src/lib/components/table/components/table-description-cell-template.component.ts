import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { get } from 'lodash-es';
import { Overwrite } from 'utility-types';

import { Column } from '../types/column';
import { createGridColumn } from '../utils/create-grid-columns';

@Component({
    selector: 'v-table-description-cell-template',
    template: `
        <ng-template #tpl let-col="colDef" let-index="index" let-row>
            <div class="v-table-description-cell-template">
                {{ getValue(col, row) }}
                <div class="mat-caption description">
                    {{ getDescription(col, row) }}
                </div>
            </div>
        </ng-template>
    `,
    styles: [``],
})
export class TableDescriptionCellTemplateComponent<T> {
    @Output() templateChange = new EventEmitter<TemplateRef<unknown>>();

    @ViewChild('tpl', { static: true }) set tpl(tpl: TemplateRef<unknown>) {
        this.templateChange.emit(tpl);
    }

    getValue(col: DescriptionColumn<T>, row: T) {
        return col.formatter
            ? col.formatter(row, col as unknown as MtxGridColumn)
            : get(row, col.field);
    }

    getDescription(col: DescriptionColumn<T>, row: T) {
        return typeof col.data.description === 'function'
            ? col.data.description(row)
            : get(row, col.data.description);
    }
}

export type DescriptionColumn<T> = Overwrite<
    MtxGridColumn<T>,
    {
        type: 'description';
    }
> & {
    data: {
        description: string | ((data: T) => string);
    };
};

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
