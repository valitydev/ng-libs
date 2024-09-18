import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    effect,
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
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
} from 'rxjs';
import { shareReplay, map, distinctUntilChanged, startWith, delay, filter } from 'rxjs/operators';

import { downloadFile, createCsv } from '../../../../utils';
import { ContentLoadingComponent } from '../../../content-loading';
import { ProgressModule } from '../../../progress';
import { Value, ValueComponent, ValueListComponent } from '../../../value';
import { sortDataByDefault } from '../../consts';
import { Column2, UpdateOptions, NormColumn } from '../../types';
import { cachedHeadMap } from '../../utils/cached-head-map';
import { TableDataSource } from '../../utils/table-data-source';
import { tableToCsvObject } from '../../utils/table-to-csv-object';
import { InfinityScrollDirective } from '../infinity-scroll.directive';
import { NoRecordsComponent } from '../no-records.component';
import { SelectColumnComponent } from '../select-column.component';
import { ShowMoreButtonComponent } from '../show-more-button/show-more-button.component';
import { TableInfoBarComponent } from '../table-info-bar/table-info-bar.component';
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
    filter = input<string>('');
    filterChange = output<string>();
    externalFilter = input(false, { transform: booleanAttribute });
    filter$ = new BehaviorSubject<string>('');
    filteredData$ = new BehaviorSubject<T[] | TreeInlineData<T, C>>([]);

    // Select
    rowSelectable = input(false, { transform: booleanAttribute });
    rowSelected = input<T[]>([]);
    rowSelectedChange = output<T[]>();
    selected = signal<T[]>([]);

    // Sort
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
        map(([treeData, data, isTreeData]) => (isTreeData ? treeData : data)),
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
                                                delay(0),
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
                                                delay(0),
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
    count$ = combineLatest([this.filter$, this.filteredData$, this.dataSourceData$]).pipe(
        map(([filter, filtered, source]) => (filter ? filtered?.length : source?.length)),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    hasAutoShowMore$ = combineLatest([
        toObservable(this.hasMore),
        this.dataSourceData$,
        this.dataSource.paginator.page.pipe(
            startWith(null),
            map(() => this.dataSource.paginator.pageSize),
        ),
        this.filteredData$,
    ]).pipe(
        map(
            ([hasMore, data, pageSize, filteredData]) =>
                (hasMore || pageSize < data.length) && filteredData === data,
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
    ) {
        effect(
            () => {
                this.selected.set(this.rowSelected());
            },
            { allowSignalWrites: true },
        );
    }

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
        combineLatest([filter$, this.dataSourceData$])
            .pipe(
                map(([f, v]) => {
                    return f ? v.filter((i) => JSON.stringify(i).includes(f)) : v;
                }),
                takeUntilDestroyed(this.dr),
            )
            .subscribe((filtered) => {
                this.filteredData$.next(filtered);
                this.updateSortFilter(filtered);
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
        // TODO: refresh table when scrolling and data is already loaded
        // eslint-disable-next-line no-self-assign
        this.dataSource.data = this.dataSource.data;
        if (this.hasMore() && this.dataSource.paginator.pageSize > this.dataSource.data.length) {
            this.more.emit({ size: this.loadSize() });
        }
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
        this.scrollViewport?.nativeElement?.scrollTo?.(0, 0);
        this.update.emit({ size: this.loadSize() });
        this.dataSource.paginator.reload();
    }

    private updateSortFilter(filtered: TreeInlineData<T, C> | T[]) {
        this.dataSource.sortData = filtered ? () => filtered : sortDataByDefault;
        this.dataSource.sort = this.sortComponent;
    }
}
