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
import { MatTableModule } from '@angular/material/table';
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
} from 'rxjs';
import { shareReplay, map, distinctUntilChanged, startWith, delay } from 'rxjs/operators';

import { downloadFile, createCsv } from '../../../../utils';
import { ContentLoadingComponent } from '../../../content-loading';
import { ProgressModule } from '../../../progress';
import { Value, ValueComponent, ValueListComponent } from '../../../value';
import { Column2, UpdateOptions, NormColumn } from '../../types';
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

    // Select
    rowSelectable = input(false, { transform: booleanAttribute });
    rowSelected = input<T[]>([]);
    rowSelectedChange = output<T[]>();
    selected = signal<T[]>([]);

    update = output<UpdateOptions>();
    more = output<UpdateOptions>();

    isTreeData = computed(() => !!this.treeData());
    treeInlineData = computed<TreeInlineData<T, C>>(() =>
        this.isTreeData()
            ? (this.treeData() ?? []).flatMap((d) => {
                  const children = d.children ?? [];
                  return [
                      children.length ? { value: d.value, child: children[0] } : { value: d.value },
                      ...children.slice(1).map((child) => ({ child })),
                  ];
              })
            : [],
    );
    dataSource = new TableDataSource<T | TreeInlineDataItem<T, C>>();
    normColumns = computed<NormColumn<T>[]>(() => this.columns().map((c) => new NormColumn(c)));
    displayedNormColumns$ = toObservable(this.normColumns).pipe(
        switchMap((cols) =>
            combineLatest(cols.map((c) => c.hidden)).pipe(
                map((c) => cols.filter((_, idx) => !c[idx])),
            ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$$: Observable<{ value: Observable<Value>; isChild?: boolean }[][]> = combineLatest([
        toObservable(this.isTreeData),
        toObservable(this.treeInlineData),
        toObservable(this.data),
        this.displayedNormColumns$,
    ]).pipe(
        scan(
            (acc, [isTree, inlineData, data, cols]) => {
                const isColsNotChanged = acc.cols === cols;
                return {
                    res: isTree
                        ? inlineData.map((d, idx) =>
                              cols.map((c) => ({
                                  value: (d.child && c.child
                                      ? c.child(d.child, idx)
                                      : d.value
                                        ? c.cell(d.value, idx)
                                        : of<Value>({ value: '' })
                                  ).pipe(
                                      shareReplay({
                                          refCount: true,
                                          bufferSize: 1,
                                          windowTime: 30_000,
                                      }),
                                  ),
                                  isChild: !d.value,
                              })),
                          )
                        : (data || []).map((d, idx) =>
                              isColsNotChanged && data[idx] === acc.data[idx]
                                  ? acc.res[idx]
                                  : cols.map((c) => ({
                                        value: c.cell(d, idx).pipe(
                                            delay(0),
                                            shareReplay({
                                                refCount: true,
                                                bufferSize: 1,
                                                windowTime: 30_000,
                                            }),
                                        ),
                                    })),
                          ),
                    data: data,
                    cols: cols,
                };
            },
            { data: [], cols: [], res: [] } as {
                data: T[];
                cols: NormColumn<T>[];
                res: { value: Observable<Value>; isChild?: boolean }[][];
            },
        ),
        map((v) => v.res),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$ = this.columnsData$$.pipe(
        switchMap((d) => combineLatest(d.map((v) => combineLatest(v.map((v) => v.value))))),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    isPreload = signal(false);
    loadSize = computed(() => (this.isPreload() ? this.maxSize() : this.size()));
    count$ = this.columnsData$$.pipe(
        map((d) => d?.length),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    dataSourceData = computed<T[] | TreeInlineData<T, C>>(() =>
        this.isTreeData() ? this.treeInlineData() : this.data(),
    );
    hasShowMore$ = combineLatest([
        toObservable(this.hasMore),
        toObservable(this.dataSourceData),
        this.dataSource.paginator.page.pipe(
            startWith(null),
            map(() => this.dataSource.paginator.pageSize),
        ),
    ]).pipe(
        map(([hasMore, data, pageSize]) => hasMore || pageSize < data.length),
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

    @ViewChild('scrollViewport') scrollViewport!: ElementRef;

    constructor(
        private dr: DestroyRef,
        private injector: Injector,
    ) {
        effect(
            () => {
                this.dataSource.data = this.dataSourceData();
            },
            {
                // TODO: not a necessary line, but after adding viewChild signal requires
                allowSignalWrites: true,
            },
        );
        effect(
            () => {
                this.selected.set(this.rowSelected());
            },
            { allowSignalWrites: true },
        );
        effect(() => {
            this.filter$.next(this.filter());
        });
    }

    ngOnInit() {
        this.filter$
            .pipe(
                map((filter) => filter?.trim?.() ?? ''),
                distinctUntilChanged(),
                debounceTime(500),
                takeUntilDestroyed(this.dr),
            )
            .subscribe((filter) => {
                this.filterChange.emit(filter);
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
}
