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
    OnDestroy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Fuse from 'fuse.js';
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
    withLatestFrom,
} from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

import { QueryParamsService, QueryParamsNamespace } from '../../services';
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
    implements OnInit, Progressable, OnChanges, AfterViewInit, OnDestroy
{
    @Input() data!: T[];
    @Input() columns!: Column<T>[];
    @Input() cellTemplate: Record<ColumnObject<T>['field'], ColumnObject<T>['cellTemplate']> = {};
    @Input() progress?: boolean | number | null = false;
    @Input() preloadedLazyRowsCount = 3;

    @Input({ transform: numberAttribute }) size: number = 25;
    @Input() preloadSize: number = 1000;
    @Input() name?: string;

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
    exactFilter$ = new BehaviorSubject(true);
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

    preloadedLazyCells = new Map<T, boolean>();

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
        return !this.progress && this.data && (!this.data.length || this.filteredDataLength === 0);
    }

    private paginator!: OnePageTableDataSourcePaginator;
    private dataUpdated$ = new Subject<void>();
    private qp?: QueryParamsNamespace<{ filter: string; exact?: boolean }>;

    constructor(
        private destroyRef: DestroyRef,
        private cdr: ChangeDetectorRef,
        private queryParamsService: QueryParamsService,
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
                map(() => (this.filterControl.value || '').trim()),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((value) => {
                delete this.filteredDataLength;
                this.filterChange.emit(value);
                if (this.qp) {
                    void this.qp.patch({ filter: value });
                }
            });
        merge(
            this.filterControl.valueChanges.pipe(distinctUntilChanged()),
            this.dataUpdated$,
            this.exactFilter$,
        )
            .pipe(
                skipWhile(() => this.filterChange.observed),
                tap(() => this.filterProgress$.next(true)),
                debounceTime(250),
                map(() => (this.filterControl.value || '').trim()),
                withLatestFrom(this.exactFilter$),
                switchMap(([filter, exact]) => {
                    if (!filter) {
                        return of(new Map());
                    }
                    // TODO: Refactor
                    return forkJoin([
                        forkJoin(
                            this.data.map((sourceValue, index) =>
                                combineLatest(
                                    Array.from(this.columnsObjects.values()).map((colDef) =>
                                        colDef.lazy
                                            ? of('')
                                            : getPossiblyAsyncObservable(
                                                  select(
                                                      sourceValue,
                                                      colDef.formatter ?? colDef.field,
                                                      '',
                                                      [index, colDef] as never,
                                                  ),
                                              ),
                                    ),
                                ).pipe(take(1)),
                            ),
                        ),
                        forkJoin(
                            this.data.map((sourceValue, index) =>
                                combineLatest(
                                    Array.from(this.columnsObjects.values()).map((colDef) =>
                                        colDef.description && !colDef.lazy
                                            ? getPossiblyAsyncObservable(
                                                  select(sourceValue, colDef.description, '', [
                                                      index,
                                                      colDef,
                                                  ] as never),
                                              )
                                            : of(''),
                                    ),
                                ).pipe(take(1)),
                            ),
                        ),
                    ]).pipe(
                        map(([formattedValues, formattedDescription]) => {
                            if (exact) {
                                return new Map(
                                    this.data
                                        .filter((d, idx) =>
                                            JSON.stringify([
                                                d,
                                                formattedValues[idx],
                                                formattedDescription[idx],
                                            ])
                                                .toLowerCase()
                                                .includes(filter.toLowerCase()),
                                        )
                                        .map((d) => [d, { score: 0 }]),
                                );
                            }
                            const fuseData = this.data.map((item, idx) => ({
                                // TODO: add weights
                                value: JSON.stringify(item),
                                formattedValue: JSON.stringify(formattedValues[idx]), // TODO: split columns
                                formattedDescription: JSON.stringify(formattedDescription[idx]),
                            }));
                            const fuse = new Fuse(fuseData, {
                                keys: Object.keys(fuseData[0]),
                                includeScore: true,
                                includeMatches: true,
                                findAllMatches: true,
                                ignoreLocation: true,
                            });
                            const filterResult = fuse.search(filter);
                            return new Map(
                                filterResult.map(({ refIndex, score }) => [
                                    this.data[refIndex],
                                    { score },
                                ]),
                            );
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((scores) => {
                this.qp?.patch?.({ exact: this.exactFilter$.value });
                this.scores = scores;
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
            this.preloadedLazyCells = new Map();
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
        if (changes.name && this.name) {
            if (this.qp) {
                this.qp.destroy();
            }
            this.qp = this.queryParamsService.createNamespace(this.name);
            const filter = this.qp.params?.filter ?? '';
            if (filter) {
                this.filterControl.patchValue(filter);
            }
            const exact = this.qp.params?.exact ?? this.exactFilter$.value;
            if (exact !== this.exactFilter$.value) {
                this.exactFilter$.next(exact);
            }
        }
    }

    ngOnDestroy() {
        this.qp?.destroy?.();
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
        if (active === this.scoreColumnDef && this.filterControl.value) {
            const maxScore = this.exactFilter$.value ? 0 : COMPLETE_MISMATCH_SCORE - 0.01;
            let sortedData = data
                .filter(
                    (data) => (this.scores.get(data)?.score ?? COMPLETE_MISMATCH_SCORE) <= maxScore,
                )
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
