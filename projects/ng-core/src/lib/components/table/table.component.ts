import { Component, Input, Output, EventEmitter, OnInit, ContentChild } from '@angular/core';
import { MtxGrid } from '@ng-matero/extensions/grid/grid';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { coerceBoolean } from 'coerce-property';
import { BehaviorSubject } from 'rxjs';

import { TableActionsComponent } from './components/table-actions.component';
import { Column } from './types/column';
import { createGridColumns } from './utils/create-grid-columns';
import { Progressable } from '../../types/progressable';

@UntilDestroy()
@Component({
    selector: 'v-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, Progressable {
    @Input() data!: T[];
    @Input() columns!: Column<T>[];
    @Input() cellTemplate: MtxGrid['cellTemplate'] = undefined as never;
    @Input() trackBy: MtxGrid['trackBy'] = undefined as never;
    @Input() progress?: boolean | number | null = false;

    @Input() @coerceBoolean rowSelectable = false;
    @Output() rowSelectionChange = new EventEmitter<T[]>();

    @Input() sizes: boolean | number[] | string = false;

    @Output() sizeChange = new EventEmitter<number>();
    @Output() update = new EventEmitter<{ size?: number }>();
    @Output() more = new EventEmitter<{ size?: number }>();

    @ContentChild(TableActionsComponent) actions!: TableActionsComponent;

    size$ = new BehaviorSubject<undefined | number>(25);

    get hasUpdate() {
        return this.update.observed;
    }

    get hasMore() {
        return this.more.observed && this.columns;
    }

    get hasToolbar() {
        return this.hasUpdate || this.actions;
    }

    get hasSizes() {
        return this.renderedSizes.length;
    }

    get renderedSizes() {
        if (Array.isArray(this.sizes)) return this.sizes;
        if (typeof this.sizes !== 'string' && !this.sizeChange.observed) return [];
        return [25, 50, 100];
    }

    get renderedColumns() {
        return createGridColumns(this.columns);
    }

    get inProgress() {
        return !!this.progress;
    }

    ngOnInit() {
        this.size$.pipe(untilDestroyed(this)).subscribe((v) => this.sizeChange.emit(v));
    }
}
