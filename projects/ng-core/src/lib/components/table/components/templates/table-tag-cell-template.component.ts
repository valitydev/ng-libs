import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { CellTemplateDirective, TemplateColumn } from './cell-template.directive';
import { Column } from '../../types/column';
import { createGridColumn } from '../../utils/create-grid-columns';

export type TagColumn<T, TTag extends PropertyKey = PropertyKey> = TemplateColumn<
    T,
    'tag',
    {
        tags: Record<TTag, { label?: string; color?: 'success' | 'pending' | ThemePalette }>;
    }
>;

@Component({
    selector: 'v-table-tag-cell-template',
    template: `
        <ng-template let-col="colDef" let-index="index" let-row>
            <div class="v-table-tag-cell-template">
                <mat-chip-option
                    [color]="getTag(col, row).color"
                    [highlighted]="!!getTag(col, row).color"
                    [ngClass]="['color-' + getTag(col, row).color]"
                    [selectable]="false"
                >
                    {{ getTag(col, row).label ?? getValue(col, row) }}
                </mat-chip-option>
            </div>
        </ng-template>
    `,
    styles: [
        `
            .v-table-tag-cell-template {
                pointer-events: none;
            }
        `,
    ],
})
export class TableTagCellTemplateComponent<T> extends CellTemplateDirective<T, TagColumn<T>> {
    getTag(col: TagColumn<T>, row: T) {
        return col.data.tags[this.getValue(col, row)];
    }
}

export function createTagColumn<T, TTag extends PropertyKey>(
    column: Column<T>,
    tags: TagColumn<T, TTag>['data']['tags']
): TagColumn<T> {
    const extCol = createGridColumn(column) as Omit<TagColumn<T, TTag>, 'type'>;
    return {
        type: 'tag',
        ...extCol,
        data: {
            ...(extCol.data || {}),
            tags,
        },
    };
}
