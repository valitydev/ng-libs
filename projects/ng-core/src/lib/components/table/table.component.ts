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
    ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Fuse from 'fuse.js';
import isNil from 'lodash-es/isNil';
import { combineLatest, isObservable, map, of, take, debounceTime } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
    @Input() preloadedLazyRowsCount = 3;

    @Input({ transform: numberAttribute }) size: number = 25;
    @Input() preloadSize: number = 1000;

    @Input({ transform: booleanAttribute }) hasMore: boolean = false;
    @Output() update = new EventEmitter<UpdateOptions>();
    @Output() more = new EventEmitter<UpdateOptions>();

    // Actions
    @Input({ transform: booleanAttribute }) noActions: boolean = false;
    @ContentChild(TableActionsComponent) actions!: TableActionsComponent;

    // Sort
    @Input() sort: Sort = { active: '', direction: '' };
    @Output() sortChange = new EventEmitter<Sort>();
    @Input({ transform: booleanAttribute }) sortOnFront: boolean = false;
    @ViewChild(MatSort) sortComponent!: MatSort;

    // Select
    @Input({ transform: booleanAttribute }) rowSelectable: boolean = false;
    @Input() rowSelected!: T[];
    @Output() rowSelectedChange = new EventEmitter<T[]>();
    selectColField = createInternalColumnField('select');

    // Filter
    @Input({ transform: booleanAttribute }) noFilter: boolean = false;
    @Input({ transform: booleanAttribute }) standaloneFilter: boolean = false;
    filterControl = new FormControl('');
    scoreColField = createInternalColumnField('score');
    scores = new Map<T, { score: number }>();
    fuse!: Fuse<unknown>;

    columnsObjects = new Map<ColumnObject<T>['field'], ColumnObject<T>>([]);

    isPreload = false;

    dataSource = new MatTableDataSource<T>();
    selection = new SelectionModel<T>(true, []);

    displayedColumns: string[] = [];

    get displayedPages() {
        return this.paginator.displayedPages;
    }

    get currentSize() {
        return this.isPreload ? this.preloadSize : this.size;
    }

    get hasShowMore() {
        return this.hasMore || this.data?.length > this.size * this.displayedPages;
    }

    private paginator!: OnePageTableDataSourcePaginator;

    constructor(
        private destroyRef: DestroyRef,
        private cdr: ChangeDetectorRef,
    ) {
        this.updatePaginator();
    }

    ngOnInit() {
        this.selection.changed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.rowSelectedChange.emit(this.selection.selected);
        });
        this.filterControl.valueChanges
            .pipe(
                debounceTime(250),
                map((v) => v ?? ''),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((filter) => {
                this.dataSource.filter = filter;
                const filterResult = this.fuse.search(filter);
                this.scores = new Map(
                    filterResult.map(({ refIndex, score }) => [
                        this.data[refIndex],
                        { score: score ?? Number.MAX_VALUE },
                    ]),
                );
                this.sort = filter
                    ? { active: this.scoreColField, direction: 'desc' }
                    : { active: '', direction: '' };
                this.tryFrontSort(this.sort);
                this.cdr.markForCheck();
            });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sortComponent;
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
            this.fuse = new Fuse(
                (this.data ?? []).map((item) => ({ json: JSON.stringify(item) })),
                { includeScore: true, keys: ['json'] },
            );
            this.tryFrontSort();
        }
        if (this.dataSource.sort && changes.sort) {
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

    private tryFrontSort({ active, direction }: Partial<Sort> = this.sortComponent || {}) {
        if (!this.data) {
            this.updateDataSourceSort();
            return;
        }
        const data = this.data;
        if (active === this.scoreColField) {
            const sorted = data
                .filter((data) => !this.filterControl.value || !isNil(this.scores.get(data)?.score))
                .slice()
                .sort((a, b) => {
                    const scoreA = this.scores.get(a)?.score ?? Infinity;
                    const scoreB = this.scores.get(b)?.score ?? Infinity;
                    return scoreA - scoreB;
                });
            this.updateDataSourceSort(direction === 'asc' ? sorted : sorted.reverse());
            return;
        }
        if (!this.sortOnFront) {
            this.updateDataSourceSort();
            return;
        }
        if (!active || !direction || !data.length) {
            this.updateDataSourceSort();
            return;
        }
        const colDef = this.columnsObjects.get(active);
        if (!colDef) {
            this.updateDataSourceSort();
            return;
        }
        const sorted = data.map((sourceValue, realIndex) => {
            const selectedValue = select(sourceValue, colDef.formatter ?? colDef.field, '', [
                realIndex,
                colDef,
            ] as never);
            return isObservable(selectedValue)
                ? selectedValue.pipe(map((value) => ({ value, realIndex, sourceValue })))
                : of({ value: selectedValue, realIndex, sourceValue });
        });
        combineLatest(sorted)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((d) => {
                let sortedData = d
                    .sort((a, b) => compareDifferentTypes(a.value, b.value))
                    .map((v) => v.sourceValue);
                if (direction === 'desc') {
                    sortedData = sortedData.reverse();
                }
                this.updateDataSourceSort(sortedData);
            });
    }

    private updateDataSourceSort(sortedData?: T[]) {
        this.dataSource.sortData = sortedData ? () => sortedData : (data) => data;
        // TODO: hack for update
        this.dataSource.sort = this.sortComponent;
    }

    private updatePaginator() {
        this.dataSource.paginator = this.paginator = new OnePageTableDataSourcePaginator(this.size);
    }

    private updateSort() {
        this.sortComponent.active = this.sort.active;
        this.sortComponent.direction = this.sort.direction;
        this.tryFrontSort();
    }

    private updateDisplayedColumns() {
        this.displayedColumns = [
            this.scoreColField,
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
