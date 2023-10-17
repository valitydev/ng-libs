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
    numberAttribute,
    booleanAttribute,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, isObservable, map, of, take } from 'rxjs';

import { Progressable } from '../../types/progressable';
import { compareDifferentTypes, ComponentChanges, select } from '../../utils';

import { TableActionsComponent } from './components/table-actions.component';
import { Column, ColumnObject, UpdateOptions } from './types';
import { createColumnsObjects } from './utils/create-columns-objects';
import { createInternalColumnField } from './utils/create-internal-column-field';
import { OnePageTableDataSourcePaginator } from './utils/one-page-table-data-source-paginator';

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

    @Input({ transform: booleanAttribute }) noActions: boolean = false;

    @Input({ transform: numberAttribute }) size: number = 25;
    @Input() preloadSize: number = 1000;

    @Input({ transform: booleanAttribute }) hasMore: boolean = false;
    @Output() update = new EventEmitter<UpdateOptions>();
    @Output() more = new EventEmitter<UpdateOptions>();

    // Sort
    @Input() sortActive?: string;
    @Input() sortDirection: SortDirection = 'asc';
    @Input({ transform: booleanAttribute }) sortOnFront: boolean = false;
    @Output() sortChange = new EventEmitter<Sort>();

    // Select
    @Input({ transform: booleanAttribute }) rowSelectable: boolean = false;
    @Input() rowSelected!: T[];
    @Output() rowSelectionChange = new EventEmitter<T[]>();

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

    private paginator!: OnePageTableDataSourcePaginator;

    constructor(private destroyRef: DestroyRef) {
        this.updatePaginator();
    }

    ngOnInit() {
        this.selection.changed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.rowSelectionChange.emit(this.selection.selected);
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.updateSort();
    }

    ngOnChanges(changes: ComponentChanges<TableComponent<T>>) {
        if (changes.columns) {
            this.updateColumns();
        }
        if (changes.columns || changes.rowSelectable) {
            this.updateDisplayedColumns();
        }
        if (this.rowSelectable && (changes.data || changes.rowSelected)) {
            this.updateSelection();
        }
        if (changes.data) {
            this.dataSource.data = this.data;
            this.tryFrontSort();
        }
        if (this.dataSource.sort && (changes.sortActive || changes.sortDirection)) {
            this.updateSort();
        }
        if (changes.size) {
            this.updatePaginator();
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
        this.tryFrontSort(sort);
    }

    private tryFrontSort({ active, direction }: Partial<Sort> = this.sort || {}) {
        if (!this.sortOnFront || !this.data) {
            return;
        }
        if (!active || !direction) {
            this.dataSource.sortData = () => this.data;
            return;
        }
        const colDef = this.columnsObjects.get(active);
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
        combineLatest(res)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((d) => {
                let sortedData = d
                    .sort((a, b) => compareDifferentTypes(a.value, b.value))
                    .map((v) => v.sourceValue);
                if (direction === 'desc') sortedData = sortedData.reverse();
                this.dataSource.sortData = () => sortedData;
                // TODO: hack for update
                this.dataSource.sort = this.sort;
            });
    }

    private updatePaginator() {
        this.dataSource.paginator = this.paginator = new OnePageTableDataSourcePaginator(this.size);
    }

    private updateSort() {
        this.sort.active = this.sortActive || '';
        this.sort.direction = this.sortDirection || '';
        this.tryFrontSort();
    }

    private updateDisplayedColumns() {
        this.displayedColumns = [
            ...(this.rowSelectable ? [this.selectColField] : []),
            ...Array.from(this.columnsObjects.values())
                .filter((c) => !c.hide)
                .map((c) => c.field),
        ];
    }

    private updateSelection() {
        const newSelected = (this.rowSelected || []).filter((d) => !!this.data?.includes?.(d));
        this.selection.deselect(...this.selection.selected.filter((s) => !newSelected.includes(s)));
        this.selection.select(...newSelected);
    }
}
