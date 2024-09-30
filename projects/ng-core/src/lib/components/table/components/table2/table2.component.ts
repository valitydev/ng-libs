import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    computed,
    DestroyRef,
    booleanAttribute,
    numberAttribute,
    signal,
    output,
    Injector,
    ElementRef,
    runInInjectionContext,
    OnInit,
    ViewChild,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import {
    combineLatest,
    Observable,
    switchMap,
    take,
    forkJoin,
    of,
    BehaviorSubject,
    debounceTime,
    scan,
    share,
    first,
    merge,
} from 'rxjs';
import { shareReplay, map, distinctUntilChanged, delay, filter, startWith } from 'rxjs/operators';

import { downloadFile, createCsv, compareDifferentTypes } from '../../../../utils';
import { ContentLoadingComponent } from '../../../content-loading';
import { ProgressModule } from '../../../progress';
import { Value, ValueComponent, ValueListComponent } from '../../../value';
import { valueToString } from '../../../value/utils/value-to-string';
import { sortDataByDefault, DEFAULT_SORT } from '../../consts';
import { Column2, UpdateOptions, NormColumn } from '../../types';
import { cachedHeadMap } from '../../utils/cached-head-map';
import { modelToSubject } from '../../utils/model-to-subject';
import { normalizeString } from '../../utils/normalize-string';
import { TableDataSource } from '../../utils/table-data-source';
import { tableToCsvObject } from '../../utils/table-to-csv-object';
import { InfinityScrollDirective } from '../infinity-scroll.directive';
import { NoRecordsComponent } from '../no-records.component';
import { SelectColumnComponent } from '../select-column.component';
import { ShowMoreButtonComponent } from '../show-more-button/show-more-button.component';
import { TableInfoBarComponent } from '../table-info-bar/table-info-bar.component';
import { TableInputsComponent } from '../table-inputs.component';
import { TableProgressBarComponent } from '../table-progress-bar.component';

import { COLUMN_DEFS } from './consts';

export type TreeDataItem<T extends object, C extends object> = { value: T; children: C[] };
export type TreeData<T extends object, C extends object> = TreeDataItem<T, C>[];
export type TreeInlineDataItem<T extends object, C extends object> = { value?: T; child?: C };
export type TreeInlineData<T extends object, C extends object> = TreeInlineDataItem<T, C>[];

export const TABLE_WRAPPER_STYLE = `
    display: block;
    overflow: auto;
    padding: 8px;
    margin: -8px;
    height: 100%;
`;

@Component({
    standalone: true,
    selector: 'v-table2',
    templateUrl: './table2.component.html',
    styleUrls: ['./table2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        ValueComponent,
        TableProgressBarComponent,
        NoRecordsComponent,
        TableInfoBarComponent,
        ShowMoreButtonComponent,
        ContentLoadingComponent,
        MatIcon,
        MatTooltip,
        MatIconButton,
        InfinityScrollDirective,
        ValueListComponent,
        SelectColumnComponent,
        ProgressModule,
        MatSortModule,
        TableInputsComponent,
        MatButton,
    ],
    host: { style: TABLE_WRAPPER_STYLE },
})
export class Table2Component<T extends object, C extends object> implements OnInit {
    data = input<T[]>([]);
    treeData = input<TreeData<T, C>>();
    columns = input<Column2<T>[]>([]);
    progress = input(false, { transform: Boolean });
    hasMore = input(false, { transform: booleanAttribute });
    size = input(25, { transform: numberAttribute });
    maxSize = input(1000, { transform: numberAttribute });

    // Filter
    filter = input('', { transform: (v: string | null | undefined) => (v || '').trim() });
    filterChange = output<string>();
    filter$ = modelToSubject(this.filter, this.filterChange);
    standaloneFilter = input(false, { transform: booleanAttribute });
    displayedData$ = new BehaviorSubject<T[] | TreeInlineData<T, C>>([]);

    // Select
    rowSelectable = input(false, { transform: booleanAttribute });
    rowSelected = input<T[] | TreeInlineData<T, C>>([]);
    rowSelectedChange = output<T[] | TreeInlineData<T, C>>();
    selected$ = modelToSubject(this.rowSelected, this.rowSelectedChange);

    // Sort
    sort = input<Sort>(DEFAULT_SORT);
    sortChange = output<Sort>();
    sort$ = modelToSubject(this.sort, this.sortChange);
    @ViewChild(MatSort) sortComponent!: MatSort;

    update = output<UpdateOptions>();
    more = output<UpdateOptions>();

    isTreeData = computed(() => !!this.treeData());
    treeInlineData$: Observable<TreeInlineData<T, C>> = toObservable(this.treeData).pipe(
        cachedHeadMap((d) => {
            const children = d.children ?? [];
            return [
                children.length ? { value: d.value, child: children[0] } : { value: d.value },
                ...children.slice(1).map((child) => ({ child })),
            ];
        }),
        map((v) => v.flat()),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    dataSource = new TableDataSource<T | TreeInlineDataItem<T, C>>();
    dataSourceData$: Observable<T[] | TreeInlineData<T, C>> = combineLatest([
        this.treeInlineData$,
        toObservable(this.data),
        toObservable(this.isTreeData),
    ]).pipe(
        map(([treeData, data, isTreeData]) => (isTreeData ? treeData : data) ?? []),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    normColumns = computed<NormColumn<T>[]>(() => this.columns().map((c) => new NormColumn(c)));
    displayedNormColumns$ = toObservable(this.normColumns).pipe(
        switchMap((cols) =>
            combineLatest(cols.map((c) => c.hidden)).pipe(
                map((c) => cols.filter((_, idx) => !c[idx])),
            ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$$: Observable<
        Map<
            T | TreeInlineDataItem<T, C>,
            { value: Observable<Value>; isChild?: boolean; isNextChild?: boolean }[]
        >
    > = combineLatest([
        toObservable(this.isTreeData),
        this.dataSourceData$,
        this.displayedNormColumns$,
    ]).pipe(
        scan(
            (acc, [isTree, data, cols]) => {
                const isColsNotChanged = acc.cols === cols;
                return {
                    res: new Map<
                        TreeInlineDataItem<T, C> | T,
                        { value: Observable<Value>; isChild?: boolean; isNextChild?: boolean }[]
                    >(
                        isTree
                            ? (data as TreeInlineData<T, C>).map((d, idx) => [
                                  d,
                                  isColsNotChanged &&
                                  d === acc.data[idx] &&
                                  // This is not the last value, because we need to calculate isNextChild
                                  idx !== acc.data.length - 1
                                      ? (acc.res.get(d) as never)
                                      : cols.map((c) => ({
                                            value: (d.child && c.child
                                                ? c.child(d.child, idx)
                                                : d.value
                                                  ? c.cell(d.value, idx)
                                                  : of<Value>({ value: '' })
                                            ).pipe(
                                                shareReplay({
                                                    refCount: true,
                                                    bufferSize: 1,
                                                }),
                                            ),
                                            isChild: !d.value,
                                            isNextChild: !(data as TreeInlineData<T, C>)[idx + 1]
                                                ?.value,
                                        })),
                              ])
                            : ((data as T[]) || []).map((d, idx) => [
                                  d,
                                  isColsNotChanged && d === acc.data[idx]
                                      ? (acc.res.get(d) as never)
                                      : cols.map((c) => ({
                                            value: c.cell(d, idx).pipe(
                                                shareReplay({
                                                    refCount: true,
                                                    bufferSize: 1,
                                                }),
                                            ),
                                        })),
                              ]),
                    ),
                    data: data,
                    cols: cols,
                };
            },
            { data: [], cols: [], res: new Map() } as {
                data: T[] | TreeInlineData<T, C>;
                cols: NormColumn<T>[];
                res: Map<
                    T | TreeInlineDataItem<T, C>,
                    { value: Observable<Value>; isChild?: boolean; isNextChild?: boolean }[]
                >;
            },
        ),
        map((v) => v.res),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$ = this.columnsData$$.pipe(
        switchMap((d) =>
            combineLatest(Array.from(d.values()).map((v) => combineLatest(v.map((v) => v.value)))),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    isPreload = signal(false);
    loadSize = computed(() => (this.isPreload() ? this.maxSize() : this.size()));
    count$ = combineLatest([this.filter$, this.displayedData$, this.dataSourceData$]).pipe(
        map(([filter, filtered, source]) => (filter ? filtered?.length : source?.length)),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    hasAutoShowMore$ = combineLatest([
        toObservable(this.hasMore),
        this.dataSourceData$,
        this.displayedData$,
        this.dataSource.paginator.page.pipe(
            startWith(null),
            map(() => this.dataSource.paginator.pageSize),
        ),
    ]).pipe(
        map(
            ([hasMore, data, filteredData, size]) =>
                (hasMore && filteredData.length === data.length) || filteredData.length > size,
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    displayedColumns$ = combineLatest([
        this.displayedNormColumns$,
        toObservable(this.rowSelectable),
    ]).pipe(
        map(([normColumns, rowSelectable]) => [
            ...(rowSelectable ? [this.columnDefs.select] : []),
            ...normColumns.map((c) => c.field),
        ]),
    );
    columnDefs = COLUMN_DEFS;

    @ViewChild('scrollViewport', { read: ElementRef }) scrollViewport!: ElementRef;
    @ViewChild('matTable', { static: false }) table!: MatTable<T>;

    constructor(
        private dr: DestroyRef,
        private injector: Injector,
    ) {}

    ngOnInit() {
        this.dataSourceData$.pipe(takeUntilDestroyed(this.dr)).subscribe((data) => {
            this.dataSource.data = data;
        });
        const filter$ = this.filter$.pipe(
            map((filter) => filter?.trim?.() ?? ''),
            distinctUntilChanged(),
            debounceTime(500),
            share(),
        );
        toObservable(this.filter, { injector: this.injector })
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe((filter) => {
                this.filter$.next(filter);
            });
        filter$.pipe(takeUntilDestroyed(this.dr)).subscribe((filter) => {
            this.filterChange.emit(filter);
        });
        combineLatest([
            filter$,
            this.sort$,
            this.dataSourceData$,
            this.columnsData$$.pipe(
                switchMap((d) =>
                    combineLatest(
                        Array.from(d.values()).map((v) => combineLatest(v.map((i) => i.value))),
                    ).pipe(
                        map(
                            (r) =>
                                new Map(
                                    Array.from(d.keys()).map((k, idx) => [
                                        k,
                                        r[idx].map((c) => ({
                                            strValue: runInInjectionContext(this.injector, () =>
                                                normalizeString(valueToString(c)),
                                            ),
                                            description: normalizeString(
                                                String(c?.description ?? ''),
                                            ),
                                            value: c,
                                            json: JSON.stringify(c),
                                        })),
                                    ]),
                                ),
                        ),
                    ),
                ),
            ),
        ])
            .pipe(
                map(([search, sort, source, data]) => {
                    let displayedData: T[] | TreeInlineData<T, C>;
                    if (search) {
                        const lowerCaseSearch = search.toLowerCase();
                        displayedData = source
                            .map((value) => ({
                                value,
                                priority: (data.get(value) ?? []).reduce((sum, v) => {
                                    if (v.strValue === search) {
                                        sum += 3000;
                                    } else if (v.strValue.includes(search)) {
                                        sum += 300;
                                    } else if (v.strValue.toLowerCase().includes(lowerCaseSearch)) {
                                        sum += 3;
                                    }
                                    if (v.description === search) {
                                        sum += 2000;
                                    } else if (v.description.includes(search)) {
                                        sum += 200;
                                    } else if (
                                        v.description.toLowerCase().includes(lowerCaseSearch)
                                    ) {
                                        sum += 2;
                                    }
                                    if (v.json.includes(search)) {
                                        sum += 10;
                                    } else if (v.json.toLowerCase().includes(lowerCaseSearch)) {
                                        sum += 1;
                                    }
                                    return sum;
                                }, 0),
                            }))
                            .filter((v) => v.priority)
                            .sort((a, b) => b.priority - a.priority)
                            .map(({ value }) => value);
                    } else {
                        displayedData = source.slice();
                    }
                    if (!sort.active) {
                        return displayedData;
                    }
                    const colIdx = this.columns().findIndex((c) => c.field === sort.active);
                    const sorted = displayedData.sort((a, b) =>
                        compareDifferentTypes(
                            (data.get(a) ?? [])[colIdx]?.strValue,
                            (data.get(b) ?? [])[colIdx]?.strValue,
                        ),
                    );
                    if (sort.direction === 'desc') {
                        return sorted.reverse();
                    }
                    return sorted;
                }),
                takeUntilDestroyed(this.dr),
            )
            .subscribe((filtered) => {
                this.updateSortFilter(filtered);
            });
        filter$.pipe(filter(Boolean), takeUntilDestroyed(this.dr)).subscribe(() => {
            this.sortChange.emit(DEFAULT_SORT);
        });
        merge(filter$, this.sort$)
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe(() => {
                this.reset();
            });
        // TODO: 2, 3 column is torn away from the previous one, fixed by calling update
        this.dataSourceData$
            .pipe(
                filter((v) => !!v?.length),
                first(),
                delay(100),
                takeUntilDestroyed(this.dr),
            )
            .subscribe(() => {
                this.table.updateStickyColumnStyles();
            });
    }

    load() {
        if (this.isPreload()) {
            this.isPreload.set(false);
        }
        this.reload();
    }

    preload() {
        if (!this.isPreload()) {
            this.isPreload.set(true);
            this.reload();
        } else if (this.hasMore()) {
            this.more.emit({ size: this.loadSize() });
        }
    }

    showMore() {
        this.dataSource.paginator.more();
        if (this.hasMore() && this.dataSource.paginator.pageSize > this.dataSource.data.length) {
            this.more.emit({ size: this.loadSize() });
        }
        this.refreshTable();
    }

    downloadCsv() {
        this.generateCsvData()
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe((csvData) => {
                downloadFile(csvData, 'csv');
            });
    }

    private generateCsvData(): Observable<string> {
        return combineLatest([
            this.displayedNormColumns$.pipe(
                switchMap((cols) => forkJoin(cols.map((c) => c.header.pipe(take(1))))),
            ),
            this.columnsData$.pipe(take(1)),
        ]).pipe(
            map(([cols, data]) =>
                createCsv(runInInjectionContext(this.injector, () => tableToCsvObject(cols, data))),
            ),
        );
    }

    private reload() {
        this.update.emit({ size: this.loadSize() });
        this.reset();
    }

    private updateSortFilter(filtered: TreeInlineData<T, C> | T[]) {
        this.displayedData$.next(filtered);
        this.dataSource.sortData = filtered ? () => filtered : sortDataByDefault;
        this.dataSource.sort = this.sortComponent;
    }

    private reset() {
        this.scrollViewport?.nativeElement?.scrollTo?.(0, 0);
        this.dataSource.paginator.reload();
        this.refreshTable();
    }

    // TODO: Refresh table when pagination is updated
    private refreshTable() {
        // eslint-disable-next-line no-self-assign
        this.dataSource.data = this.dataSource.data;
    }
}
