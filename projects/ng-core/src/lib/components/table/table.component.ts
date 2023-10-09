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
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import {
    MatTableDataSource,
    MatTableDataSourcePageEvent,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import { coerceBoolean } from 'coerce-property';
import { combineLatest, isObservable, map, of, Subject, take } from 'rxjs';

import { Progressable } from '../../types/progressable';
import { compareDifferentTypes, ComponentChanges, select } from '../../utils';

import { TableActionsComponent } from './components/table-actions.component';
import { Column, ColumnObject } from './types';
import { createColumnsObjects } from './utils/create-columns-objects';

export type UpdateOptions = {
    size: number;
};

class VirtualPaginator implements MatTableDataSourcePaginator {
    page = new Subject<MatTableDataSourcePageEvent>();
    pageIndex = 0;
    initialized = of(undefined);
    length = 0;
    pageSize = 0;

    get displayedPages() {
        return this.pageSize / this.partSize;
    }

    constructor(private partSize = 25) {
        this.pageSize = partSize;
    }

    firstPage() {
        return 0;
    }

    lastPage() {
        return 0;
    }

    reload() {
        this.pageSize = this.partSize;
        this.update();
    }

    more() {
        this.pageSize += this.partSize;
        this.update();
    }

    private update() {
        this.page.next({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
        });
    }
}

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
    @Input() cellTemplate: ColumnObject<T>['cellTemplate'] = undefined as never;
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
    @ViewChild('cellTpl', { static: true }) defaultCellTemplate!: TemplateRef<unknown>;
    @ViewChild(MatSort) sort!: MatSort;

    renderedColumns!: ColumnObject<T>[];
    hasReset = false;

    renderedCellTemplate!:
        | ColumnObject<T>['cellTemplate']
        | Record<string, ColumnObject<T>['cellTemplate']>;

    isPreload = false;

    dataSource = new MatTableDataSource<T>();
    selection = new SelectionModel<T>(true, []);

    selectColField = '___$SELECT_COL';
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
                ...this.renderedColumns.filter((c) => !c.hide).map((c) => c.field),
            ];
        }
        if (changes.cellTemplate) {
            this.updateCellTemplate();
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

    updateColumns(columns?: ColumnObject<T>[]) {
        this.hasReset = !!columns;
        this.renderedColumns = columns ? columns.slice() : createColumnsObjects(this.columns);
        this.updateCellTemplate();
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
        const colDef = this.renderedColumns.find((c) => c.field === sort.active);
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
                this.dataSource.sortData = () =>
                    d
                        .sort((a, b) => compareDifferentTypes(a.value, b.value))
                        .map((v) => v.sourceValue);
            });
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
            ]),
        );
    }
}
