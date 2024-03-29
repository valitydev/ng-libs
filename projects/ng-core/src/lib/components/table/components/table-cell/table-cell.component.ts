import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    booleanAttribute,
    Output,
    EventEmitter,
} from '@angular/core';

import { ColumnFn, ColumnObject } from '../../types';

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

    @Input({ transform: booleanAttribute }) preloadLazy = false;

    @Output() preloadedLazyChange = new EventEmitter<boolean>();

    lazyVisible = false;

    getLabel(label: string | ColumnFn<T, string>, index: number) {
        return typeof label === 'string' ? label : label(this.rowData, index);
    }
}
