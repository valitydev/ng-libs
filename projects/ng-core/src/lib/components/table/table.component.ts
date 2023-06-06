import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import { UntilDestroy } from '@ngneat/until-destroy';
import { coerceBoolean } from 'coerce-property';
import { get } from 'lodash-es';

import { TableActionsComponent } from './components/table-actions.component';
import { Column } from './types/column';
import { createMtxGridColumns } from './utils/create-mtx-grid-columns';
import { Progressable } from '../../types/progressable';
import { ComponentChanges } from '../../utils';

export type UpdateOptions = {
    size: number;
};

@UntilDestroy()
@Component({
    selector: 'v-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends object> implements Progressable, OnChanges {
    @Input() data!: T[];
    @Input() columns!: Column<T>[];
    @Input() cellTemplate: MtxGrid['cellTemplate'] = undefined as never;
    @Input() trackBy: MtxGrid['trackBy'] = undefined as never;
    @Input() trackByField?: string;
    @Input() progress?: boolean | number | null = false;

    @Input() @coerceBoolean noActions: boolean | '' = false;

    @Input() @coerceBoolean rowSelectable: boolean | '' = false;
    @Input() rowSelected!: T[];
    @Output() rowSelectionChange = new EventEmitter<T[]>();

    @Input() size: number = 25;
    @Input() preloadSize: number = 1000;

    @Input() @coerceBoolean hasMore?: boolean | null | '' = false;
    @Output() more = new EventEmitter<UpdateOptions>();
    @Output() update = new EventEmitter<UpdateOptions>();

    @Input() sortActive?: string;
    @Input() sortDirection?: SortDirection;
    @Output() sortChange = new EventEmitter<Sort>();

    @ContentChild(TableActionsComponent) actions!: TableActionsComponent;
    @ViewChild('cellTpl', { static: true }) defaultCellTemplate!: TemplateRef<unknown>;

    renderedColumns!: MtxGridColumn<T>[];
    hasReset = false;

    renderedCellTemplate!: MtxGrid['cellTemplate'];

    internalSelected: T[] = [];

    isPreload = false;
    displayedPages = 1;

    get currentSize() {
        return this.isPreload ? this.preloadSize : this.size;
    }

    ngOnChanges(changes: ComponentChanges<TableComponent<T>>) {
        if (changes.columns) {
            this.updateColumns();
        }
        if (changes.cellTemplate) {
            this.updateCellTemplate();
        }
        if (changes.data || changes.rowSelected) {
            this.select(this.rowSelected, true);
        }
    }

    updateColumns(columns?: MtxGridColumn<T>[]) {
        this.hasReset = !!columns;
        const renderedColumns = columns ? columns.slice() : createMtxGridColumns(this.columns);
        renderedColumns.forEach((c) => (c.hide = typeof c.show === 'boolean' ? !c.show : !!c.hide));
        this.renderedColumns = renderedColumns;
        this.updateCellTemplate();
    }

    trackByFieldFn(index: number, item: T) {
        return get(item, this.trackByField ?? '');
    }

    select(selected: T[], noEmit = false) {
        if (selected && !selected.every((d) => this.data?.includes(d))) {
            selected = [];
            noEmit = false;
        }
        this.internalSelected = selected;
        if (!noEmit) {
            this.rowSelectionChange.emit(selected);
        }
    }

    load(isPreload = false) {
        if (this.isPreload !== isPreload) {
            this.isPreload = isPreload;
        }
        this.update.emit({ size: this.currentSize });
        this.displayedPages = 1;
    }

    preload() {
        if (this.isPreload && this.hasMore) {
            this.more.emit({ size: this.currentSize });
            return;
        }
        this.load(true);
    }

    showMore() {
        this.displayedPages += 1;
        if (this.displayedPages * this.size > (this.data?.length || 0)) {
            this.more.emit({ size: this.currentSize });
        }
    }

    private updateCellTemplate() {
        if (this.cellTemplate instanceof TemplateRef) {
            this.renderedCellTemplate = this.cellTemplate;
            return;
        }
        if (!this.cellTemplate && this.renderedColumns.every((c) => !c.cellTemplate)) {
            this.renderedCellTemplate = this.defaultCellTemplate;
            return;
        }
        this.renderedCellTemplate = Object.fromEntries(
            this.renderedColumns.map((c) => [
                c.field,
                this.cellTemplate?.[c.field as never] ?? c.cellTemplate ?? this.defaultCellTemplate,
            ])
        );
    }
}
