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
import {
    combineLatest,
    map,
    of,
    take,
    debounceTime,
    switchMap,
    forkJoin,
    Subject,
    merge,
    skipWhile,
    BehaviorSubject,
    tap,
} from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

import { Progressable } from '../../types/progressable';
import {
    compareDifferentTypes,
    ComponentChanges,
    select,
    getPossiblyAsyncObservable,
} from '../../utils';

import { TableActionsComponent } from './components/table-actions.component';
import { Column, ColumnObject, UpdateOptions } from './types';
import { createColumnsObjects } from './utils/create-columns-objects';
import { createInternalColumnDef } from './utils/create-internal-column-def';
import { OnePageTableDataSourcePaginator } from './utils/one-page-table-data-source-paginator';

const COMPLETE_MISMATCH_SCORE = 1;

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
    selectColumnDef = createInternalColumnDef('select');

    // Filter
    @Input({ transform: booleanAttribute }) noFilter: boolean = false;
    @Input({ transform: booleanAttribute }) standaloneFilter: boolean = false;
    @Input() filter = '';
    @Output() filterChange = new EventEmitter<string>();
    filterControl = new FormControl('');
    scoreColumnDef = createInternalColumnDef('score');
    scores = new Map<T, { score: number }>();
    filteredDataLength?: number;
    filterProgress$ = new BehaviorSubject(false);

    columnsObjects = new Map<ColumnObject<T>['field'], ColumnObject<T>>([]);

    isPreload = false;

    dataSource = new MatTableDataSource<T>();
    selection = new SelectionModel<T>(true, []);

    displayedColumns: string[] = [];

    noRecordsColumnDef = createInternalColumnDef('no-records');

    get displayedPages() {
        return this.paginator.displayedPages;
    }

    get currentSize() {
        return this.isPreload ? this.preloadSize : this.size;
    }

    get hasShowMore() {
        return this.hasMore || this.data?.length > this.size * this.displayedPages;
    }

    get isNoRecords() {
        return (
            !this.progress &&
            this.data &&
            (!this.data.length || (!!this.filterControl.value && this.filteredDataLength === 0))
        );
    }

    private paginator!: OnePageTableDataSourcePaginator;
    private dataUpdated$ = new Subject<void>();

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
                startWith(null),
                map(() => (this.filterControl.value ?? '')?.trim()),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((value) => {
                this.filterChange.emit(value);
            });
        merge(this.filterControl.valueChanges.pipe(distinctUntilChanged()), this.dataUpdated$)
            .pipe(
                skipWhile(() => this.filterChange.observed),
                tap(() => this.filterProgress$.next(true)),
                debounceTime(250),
                map(() => this.filterControl.value ?? ''),
                switchMap((filter) => {
                    if (!filter) {
                        return of([]);
                    }
                    return forkJoin(
                        this.data.map((sourceValue, index) =>
                            combineLatest(
                                Array.from(this.columnsObjects.values()).map((colDef) =>
                                    getPossiblyAsyncObservable(
                                        select(sourceValue, colDef.formatter ?? colDef.field, '', [
                                            index,
                                            colDef,
                                        ] as never),
                                    ),
                                ),
                            ).pipe(take(1)),
                        ),
                    ).pipe(
                        map((formattedValues) => {
                            const fuseData = this.data.map((item, idx) => ({
                                // TODO: add weights
                                value: JSON.stringify(item),
                                formattedValue: JSON.stringify(formattedValues[idx]), // TODO: split columns
                            }));
                            const fuse = new Fuse(fuseData, {
                                includeScore: true,
                                keys: Object.keys(fuseData[0]),
                            });
                            return fuse.search(filter);
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((filterResult) => {
                this.scores = new Map(
                    filterResult.map(({ refIndex, score }) => [
                        this.data[refIndex],
                        { score: score ?? COMPLETE_MISMATCH_SCORE },
                    ]),
                );
                this.sort = this.filterControl.value
                    ? { active: this.scoreColumnDef, direction: 'asc' }
                    : { active: '', direction: '' };
                this.tryFrontSort(this.sort);
                this.filterProgress$.next(false);
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
            this.dataUpdated$.next();
        }
        if (this.dataSource.sort && changes.sort) {
            this.updateSort();
        }
        if (changes.size) {
            this.updatePaginator();
        }
        if (changes.filter) {
            this.filterControl.setValue(this.filter ?? '');
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
        const data = this.data;
        if (active === this.scoreColumnDef) {
            let sortedData = data
                .filter((data) => !this.filterControl.value || !isNil(this.scores.get(data)?.score))
                .sort(
                    (a, b) =>
                        (this.scores.get(a)?.score ?? COMPLETE_MISMATCH_SCORE) -
                        (this.scores.get(b)?.score ?? COMPLETE_MISMATCH_SCORE),
                );
            if (direction === 'desc') {
                sortedData = sortedData.reverse();
            }
            this.filteredDataLength = sortedData.length;
            this.updateDataSourceSort(sortedData);
            return;
        }
        if (!data?.length || !active || !direction || !this.sortOnFront) {
            this.updateDataSourceSort();
            return;
        }
        if (this.filterControl.value) {
            this.filterControl.setValue('', { emitEvent: false });
        }
        const colDef = this.columnsObjects.get(active);
        if (!colDef) {
            this.updateDataSourceSort();
            return;
        }
        combineLatest(
            data.map((sourceValue, index) =>
                getPossiblyAsyncObservable(
                    select(sourceValue, colDef.formatter ?? colDef.field, '', [
                        index,
                        colDef,
                    ] as never),
                ).pipe(map((value) => ({ value, sourceValue }))),
            ),
        )
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((loadedData) => {
                let sortedData = loadedData
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
            this.scoreColumnDef,
            ...(this.rowSelectable ? [this.selectColumnDef] : []),
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
