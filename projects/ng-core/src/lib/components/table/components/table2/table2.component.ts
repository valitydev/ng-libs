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
    ContentChild,
    model,
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
    BehaviorSubject,
    debounceTime,
    share,
    first,
    merge,
    tap,
    defer,
} from 'rxjs';
import { shareReplay, map, distinctUntilChanged, delay, filter, startWith } from 'rxjs/operators';

import {
    downloadFile,
    createCsv,
    arrayAttribute,
    ArrayAttributeTransform,
    Nil,
} from '../../../../utils';
import { ContentLoadingComponent } from '../../../content-loading';
import { ProgressModule } from '../../../progress';
import { ValueComponent, ValueListComponent } from '../../../value';
import { sortDataByDefault, DEFAULT_SORT } from '../../consts';
import { Column2, UpdateOptions, NormColumn } from '../../types';
import { modelToSubject } from '../../utils/model-to-subject';
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
import { TreeData, TreeInlineData } from './tree-data';
import { columnsDataToFilterSearchData, filterData, sortData } from './utils/filter-sort';
import { toObservableColumnsData, toColumnsData } from './utils/to-columns-data';

export const TABLE_WRAPPER_STYLE = `
    display: block;
    overflow: auto;
    padding: 8px;
    margin: -8px;
    height: 100%;
`;

const DEBOUNCE_TIME_MS = 500;

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
    data = input<T[]>();
    treeData = input<TreeData<T, C>>();
    columns = input<Column2<T, C>[], ArrayAttributeTransform<Column2<T, C>>>([], {
        transform: arrayAttribute,
    });
    progress = input(false, { transform: Boolean });
    hasMore = input(false, { transform: booleanAttribute });
    size = input(25, { transform: numberAttribute });
    maxSize = input(1000, { transform: numberAttribute });
    noDownload = input(false, { transform: booleanAttribute });

    // Filter
    filter = model('');
    filter$ = toObservable(this.filter).pipe(
        map((v) => (v || '').trim()),
        distinctUntilChanged(),
        debounceTime(DEBOUNCE_TIME_MS),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    standaloneFilter = input(false, { transform: booleanAttribute });
    externalFilter = input(false, { transform: booleanAttribute });
    filteredSortData$ = new BehaviorSubject<T[] | TreeInlineData<T, C> | null>(null);
    displayedData$ = combineLatest([
        defer(() => this.dataSource.data$),
        this.filteredSortData$,
        defer(() => this.columnsDataProgress$),
    ]).pipe(
        map(([data, filteredSortData, columnsDataProgress]) =>
            filteredSortData && !columnsDataProgress ? filteredSortData : data,
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    displayedCount$ = this.displayedData$.pipe(
        map((data) => data?.length || 0),
        distinctUntilChanged(),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

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

    dataSource = new TableDataSource<T, C>();
    normColumns = computed<NormColumn<T, C>[]>(() => this.columns().map((c) => new NormColumn(c)));
    displayedNormColumns$ = toObservable(this.normColumns).pipe(
        switchMap((cols) =>
            combineLatest(cols.map((c) => c.hidden)).pipe(
                map((c) => cols.filter((_, idx) => !c[idx])),
            ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$$ = combineLatest({
        isTree: this.dataSource.isTreeData$,
        data: this.dataSource.data$,
        cols: toObservable(this.normColumns),
    }).pipe(toObservableColumnsData, shareReplay({ refCount: true, bufferSize: 1 }));
    columnsDataProgress$ = new BehaviorSubject(false);
    columnsData$ = this.columnsData$$.pipe(
        tap(() => {
            this.columnsDataProgress$.next(true);
        }),
        toColumnsData,
        tap(() => {
            this.columnsDataProgress$.next(false);
        }),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    isPreload = signal(false);
    loadSize = computed(() => (this.isPreload() ? this.maxSize() : this.size()));
    hasAutoShowMore$ = combineLatest([
        toObservable(this.hasMore),
        this.dataSource.data$,
        this.displayedCount$,
        this.dataSource.paginator.page.pipe(
            startWith(null),
            map(() => this.dataSource.paginator.pageSize),
        ),
    ]).pipe(
        map(
            ([hasMore, data, displayedCount, size]) =>
                (hasMore && displayedCount === data.length) || displayedCount > size,
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
    @ContentChild(TableInputsComponent, { read: ElementRef }) tableInputsContent!: ElementRef;

    constructor(
        private dr: DestroyRef,
        private injector: Injector,
    ) {}

    ngOnInit() {
        toObservable(this.data, { injector: this.injector })
            .pipe(filter(Boolean), takeUntilDestroyed(this.dr))
            .subscribe((data) => {
                this.dataSource.setData(data);
            });
        toObservable(this.treeData, { injector: this.injector })
            .pipe(filter(Boolean), takeUntilDestroyed(this.dr))
            .subscribe((data) => {
                this.dataSource.setTreeData(data);
            });
        combineLatest([
            this.filter$,
            this.sort$,
            this.dataSource.data$,
            runInInjectionContext(this.injector, () =>
                this.columnsData$.pipe(columnsDataToFilterSearchData),
            ),
            this.dataSource.isTreeData$,
            toObservable(this.normColumns, { injector: this.injector }),
            toObservable(this.externalFilter, { injector: this.injector }),
        ])
            .pipe(
                map(([search, sort, source, data, isTreeData, columns, isExternalFilter]) => {
                    if (isTreeData) {
                        return source;
                    }
                    const filteredData =
                        !isExternalFilter && search ? filterData(data, search) : source.slice();
                    return sortData(filteredData, data, columns, sort);
                }),
                takeUntilDestroyed(this.dr),
            )
            .subscribe((filtered) => {
                this.updateSortFilter(filtered);
            });
        this.filter$.pipe(filter(Boolean), takeUntilDestroyed(this.dr)).subscribe(() => {
            this.sortChange.emit(DEFAULT_SORT);
        });
        merge(this.filter$, this.sort$)
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe(() => {
                this.reset();
            });
        // TODO: 2, 3 column is torn away from the previous one, fixed by calling update
        this.dataSource.data$
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
        this.filteredSortData$.next(filtered);
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
