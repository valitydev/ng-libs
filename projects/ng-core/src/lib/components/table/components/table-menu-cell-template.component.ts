import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { Overwrite } from 'utility-types';

@Component({
    selector: 'v-table-menu-cell-template',
    template: `
        <ng-template #tpl let-col="colDef" let-index="index" let-row>
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
export class TableMenuCellTemplateComponent {
    @Output() templateChange = new EventEmitter<TemplateRef<unknown>>();

    @ViewChild('tpl', { static: true }) set tpl(tpl: TemplateRef<unknown>) {
        this.templateChange.emit(tpl);
    }
}

export type MenuColumn<T> = Overwrite<
    MtxGridColumn<T>,
    {
        type: 'menu';
    }
> & {
    data: {
        items: {
            label: string;
            click?: (rowData: T) => void;
        }[];
    };
};