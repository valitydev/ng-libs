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
    BehaviorSubject,
    tap,
    Observable,
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
import { TableInputsComponent } from './components/table-inputs.component';
import { Column, ColumnObject, UpdateOptions } from './types';
import { createColumnsObjects } from './utils/create-columns-objects';
import { createInternalColumnDef } from './utils/create-internal-column-def';
import { OnePageTableDataSourcePaginator } from './utils/one-page-table-data-source-paginator';

const COMPLETE_MISMATCH_SCORE = 1;
const DEFAULT_SORT: Sort = { active: '', direction: '' };
const DEFAULT_DEBOUNCE_TIME_MS = 250;
const DEFAULT_SORT_DATA: <T>(data: T[], sort: MatSort) => T[] = (data) => data;

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
    @ContentChild(TableInputsComponent) inputs!: TableInputsComponent;

    // Sort
    @Input() sort: Sort = DEFAULT_SORT;
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
    @Input({ transform: booleanAttribute }) externalFilter: boolean = false;
    @Input() filter = '';
    @Input() filterByColumns?: string[];
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
        return (
            this.hasMore ||
            (this.filteredDataLength ?? this.data?.length) > this.size * this.displayedPages
        );
    }

    get isNoRecords() {
        return !this.data?.length || this.filteredDataLength === 0;
    }

    private paginator!: OnePageTableDataSourcePaginator;
    private dataUpdated$ = new Subject<void>();
    private qp?: QueryParamsNamespace<{ filter: string; exact?: boolean }>;

    constructor(
        private destroyRef: DestroyRef,
        private queryParamsService: QueryParamsService,
    ) {
        this.updatePaginator();
    }

    ngOnInit() {
        this.selection.changed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.rowSelectedChange.emit(this.selection.selected);
        });
        const startValue = this.filterControl.value;
        const filter$ = this.filterControl.valueChanges.pipe(
            ...((startValue ? [startWith(startValue)] : []) as []),
            map((value) => (value || '').trim()),
            debounceTime(DEFAULT_DEBOUNCE_TIME_MS),
            distinctUntilChanged(),
        );
        filter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((filter) => {
            this.filterChange.emit(filter);
            this.qp?.patch?.({ filter });
        });
        const exactFilter$ = this.exactFilter$.pipe(distinctUntilChanged());
        exactFilter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((exact) => {
            this.qp?.patch?.({ exact });
        });
        combineLatest([filter$, exactFilter$, this.dataUpdated$])
            .pipe(
                tap(() => this.filterProgress$.next(true)),
                debounceTime(DEFAULT_DEBOUNCE_TIME_MS),
                switchMap(([filter, exact]): Observable<[Map<T, { score: number }>, string]> => {
                    if (!filter || this.externalFilter || !this.data?.length) {
                        return of([new Map(), filter]);
                    }
                    const cols = this.filterByColumns
                        ? this.filterByColumns.map(
                              (c) => this.columnsObjects.get(c) as ColumnObject<T>,
                          )
                        : Array.from(this.columnsObjects.values());
                    // TODO: Refactor
                    return (
                        cols.length
                            ? forkJoin([
                                  forkJoin(
                                      this.data.map((sourceValue, index) =>
                                          combineLatest(
                                              cols.map((colDef) =>
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
                                              cols.map((colDef) =>
                                                  colDef.description && !colDef.lazy
                                                      ? getPossiblyAsyncObservable(
                                                            select(
                                                                sourceValue,
                                                                colDef.description,
                                                                '',
                                                                [index, colDef] as never,
                                                            ),
                                                        )
                                                      : of(''),
                                              ),
                                          ).pipe(take(1)),
                                      ),
                                  ),
                              ])
                            : of([[] as unknown[], [] as unknown[]])
                    ).pipe(
                        map(([formattedValues, formattedDescription]) => {
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
                                threshold: exact ? 0 : 0.6,
                            });
                            const filterResult = fuse.search(filter);
                            return [
                                new Map(
                                    filterResult.map(({ refIndex, score }) => [
                                        this.data[refIndex],
                                        { score: score ?? COMPLETE_MISMATCH_SCORE },
                                    ]),
                                ),
                                filter,
                            ];
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(([scores, filter]) => {
                this.scores = scores;
                delete this.filteredDataLength;
                this.sortChanged(
                    filter && !this.externalFilter
                        ? { active: this.scoreColumnDef, direction: 'asc' }
                        : this.sortComponent.active === this.scoreColumnDef
                        ? DEFAULT_SORT
                        : this.sort,
                );
                this.filterProgress$.next(false);
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
        if (changes.externalFilter) {
            this.dataUpdated$.next();
        }
        if (changes.sortOnFront || changes.data) {
            this.tryFrontSort();
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
            let sortedData = data
                .filter(
                    (data) =>
                        (this.scores.get(data)?.score ?? COMPLETE_MISMATCH_SCORE) <
                        COMPLETE_MISMATCH_SCORE,
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
            this.filterControl.setValue('');
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
        this.dataSource.sortData = sortedData ? () => sortedData : DEFAULT_SORT_DATA;
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
