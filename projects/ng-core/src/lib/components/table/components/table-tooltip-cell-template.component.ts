import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';

import { createGridColumn, GridColumn } from '../utils/create-grid-columns';
import { Column } from '../types/column';

@Component({
    selector: 'v-table-tooltip-cell-template',
    template: `
        <ng-template #tpl let-col="colDef" let-index="index" let-row>
            <div
                *ngIf="col.formatter ? col.formatter(row, col) : row[col.field] as val"
                [matTooltip]="col._data?.tooltip && (col._data.tooltip(row) | json)"
                [ngClass]="{ dashed: !!col._data?.tooltip?.(row) }"
                matTooltipPosition="right"
            >
                {{ val }}
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
export class TableTooltipCellTemplateComponent {
    @Output() template = new EventEmitter<TemplateRef<any>>();

    @ViewChild('tpl', { static: true }) set tpl(tpl: TemplateRef<any>) {
        this.template.emit(tpl);
    }
}

export function createTooltipTemplateGridColumn<T>(col: Column<T>, tooltip: (data: T) => any) {
    return { ...createGridColumn(col), _data: { tooltip } };
}
