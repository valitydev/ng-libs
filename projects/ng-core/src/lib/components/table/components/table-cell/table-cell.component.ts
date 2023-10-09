import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { ColumnObject } from '../../types';

@Component({
    selector: 'v-table-cell',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent<T extends object> {
    @HostBinding('class.v-table-cell') hostClass: boolean = true;

    @Input() rowData!: T;
    @Input() colDef!: ColumnObject<T>;
    @Input() index!: number;
}
