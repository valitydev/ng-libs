import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { coerceBoolean } from 'coerce-property';
import { combineLatest, isObservable, map, of, take } from 'rxjs';

import { Progressable } from '../../types/progressable';
import { compareDifferentTypes, ComponentChanges, select } from '../../utils';

import { TableActionsComponent } from './components/table-actions.component';
import { Column, ColumnObject } from './types';
import { createColumnsObjects } from './utils/create-columns-objects';
import { createInternalColumnField } from './utils/create-internal-column-field';
import { VirtualPaginator } from './utils/virtual-paginator';

export type UpdateOptions = {
    size: number;
};

@Component({
    selector: 'v-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends object>
    implements OnInit, Progressable, OnChanges, AfterViewInit
{
    @Input() data!: T[];
    @Input() columns!: Column<T>[];
    @Input() cellTemplate: Record<ColumnObject<T>['field'], ColumnObject<T>['cellTemplate']> = {};
    @Input() progress?: boolean | number | null = false;
    @Input() @coerceBoolean sortOnFront: boolean | '' = false;

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
    @ViewChild(MatSort) sort!: MatSort;

    columnsObjects = new Map<ColumnObject<T>['field'], ColumnObject<T>>([]);

    isPreload = false;

    dataSource = new MatTableDataSource<T>();
    selection = new SelectionModel<T>(true, []);

    selectColField = createInternalColumnField('select');
    displayedColumns: string[] = [];

    get displayedPages() {
        return this.paginator.displayedPages;
    }

    get currentSize() {
        return this.isPreload ? this.preloadSize : this.size;
    }

    get hasShowMore() {
        return !!this.hasMore || this.data?.length > this.size * this.displayedPages;
    }

    private paginator = new VirtualPaginator(this.size);

    constructor(private destroyRef: DestroyRef) {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.selection.changed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.rowSelectionChange.emit(this.selection.selected);
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: ComponentChanges<TableComponent<T>>) {
        if (changes.columns) {
            this.updateColumns();
        }
        if (changes.columns || changes.rowSelectable) {
            this.displayedColumns = [
                ...(this.rowSelectable ? [this.selectColField] : []),
                ...Array.from(this.columnsObjects.values())
                    .filter((c) => !c.hide)
                    .map((c) => c.field),
            ];
        }
        if (
            changes.rowSelectable &&
            (changes.data || (changes.rowSelected && Array.isArray(this.rowSelected)))
        ) {
            const newSelected = this.rowSelected.filter((d) => !!this.data?.includes?.(d));
            this.selection.deselect(
                ...this.selection.selected.filter((s) => !newSelected.includes(s)),
            );
            this.selection.select(...newSelected);
        }
        if (changes.data) {
            this.dataSource.data = this.data;
        }
        if (this.sort) {
            if (changes.sortActive) {
                this.sort.active = this.sortActive || '';
            }
            if (changes.sortDirection) {
                this.sort.direction = this.sortDirection || '';
            }
        }
    }

    updateColumns(columns: ColumnObject<T>[] = createColumnsObjects(this.columns)) {
        this.columnsObjects = new Map((columns || []).map((c) => [c.field, c]));
    }

    load(isPreload = false) {
        if (this.isPreload !== isPreload) {
            this.isPreload = isPreload;
        }
        this.update.emit({ size: this.currentSize });
        this.paginator.reload();
    }

    preload() {
        if (this.isPreload && this.hasMore) {
            this.more.emit({ size: this.currentSize });
            return;
        }
        this.load(true);
    }

    showMore() {
        this.paginator.more();
        if (this.hasMore && this.displayedPages * this.size > this.data?.length) {
            this.more.emit({ size: this.currentSize });
        }
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear(true);
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    sortChanged(sort: Sort) {
        this.sortChange.emit(sort);
        if (!this.sortOnFront) {
            return;
        }
        if (!sort.active || !sort.direction) {
            this.dataSource.sortData = () => this.data;
            return;
        }
        const colDef = this.columnsObjects.get(sort.active);
        if (!colDef) {
            this.dataSource.sortData = () => this.data;
            return;
        }
        const res = this.data.map((sourceValue, realIndex) => {
            const s = select(sourceValue, colDef.formatter ?? colDef.field, '', [
                realIndex,
                colDef,
            ] as never);
            return isObservable(s)
                ? s.pipe(map((value) => ({ value, realIndex, sourceValue })))
                : of({ value: s, realIndex, sourceValue });
        });
        return combineLatest(res)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((d) => {
                let r = d
                    .sort((a, b) => compareDifferentTypes(a.value, b.value))
                    .map((v) => v.sourceValue);
                if (sort.direction === 'desc') r = r.reverse();
                this.dataSource.sortData = () => r;
            });
    }
}
