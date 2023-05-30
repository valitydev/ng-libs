import { Component, HostBinding, Input } from '@angular/core';

import { ExtColumn } from '../../types/column';

@Component({
    selector: 'v-table-cell',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
})
export class TableCellComponent<T extends object> {
    @HostBinding('class.v-table-cell-template') hostClass: boolean = true;

    @Input() rowData!: T;
    @Input() colDef!: ExtColumn<T>;
    @Input() index!: number;
}
