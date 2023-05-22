import { Component } from '@angular/core';

import { CellTemplateDirective, TemplateColumn } from './cell-template.directive';
import { Column } from '../../types/column';
import { createGridColumn } from '../../utils/create-grid-columns';

export type MenuColumn<T> = TemplateColumn<
    T,
    'menu',
    {
        items: {
            label: string;
            click?: (rowData: T) => void;
        }[];
    }
>;

@Component({
    selector: 'v-table-menu-cell-template',
    template: `
        <ng-template let-col="colDef" let-index="index" let-row>
            <button [matMenuTriggerFor]="menu" class="button" mat-icon-button>
                <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
                <button *ngFor="let item of col.data.items" mat-menu-item (click)="item.click(row)">
                    {{ item.label }}
                </button>
            </mat-menu>
        </ng-template>
    `,
    styles: [
        `
            .button {
                margin: -2.5px 0;
            }
        `,
    ],
})
export class TableMenuCellTemplateComponent<T> extends CellTemplateDirective<T, MenuColumn<T>> {}

export function createOperationMenuColumn<T>(
    column: Column<T>,
    items: MenuColumn<T>['data']['items']
): MenuColumn<T> {
    const menuCol = createGridColumn(column) as Omit<MenuColumn<T>, 'type'>;
    return {
        type: 'menu',
        pinned: 'right',
        width: '0',
        ...menuCol,
        header: typeof column === 'string' ? '' : menuCol.header,
        data: {
            ...(menuCol.data || {}),
            items,
        },
    };
}
