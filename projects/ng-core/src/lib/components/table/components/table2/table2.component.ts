import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
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
    viewChild,
    ElementRef,
    PipeTransform,
    Pipe,
    runInInjectionContext,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { combineLatest, Observable, switchMap, take, forkJoin, of } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { downloadFile, createCsv } from '../../../../utils';
import { ContentLoadingComponent } from '../../../content-loading';
import { Value, ValueComponent, ValueListComponent } from '../../../value';
import { Column2, UpdateOptions, NormColumn } from '../../types';
import { TableDataSource } from '../../utils/table-data-source';
import { tableToCsvObject } from '../../utils/table-to-csv-object';
import { InfinityScrollDirective } from '../infinity-scroll.directive';
import { NoRecordsComponent } from '../no-records.component';
import { SelectColumnComponent } from '../select-column.component';
import { ShowMoreButtonComponent } from '../show-more-button/show-more-button.component';
import { TableInfoBarComponent } from '../table-info-bar.component';
import { TableProgressBarComponent } from '../table-progress-bar.component';

import { COLUMN_DEFS } from './consts';

export type TreeDataItem<T extends object, C extends object> = { value: T; children: C[] };
export type TreeData<T extends object, C extends object> = TreeDataItem<T, C>[];

@Pipe({ standalone: true, name: 'virtualScrollIndex' })
export class VirtualScrollIndexPipe implements PipeTransform {
    transform(index: number, scrollViewport: CdkVirtualScrollViewport) {
        return index + scrollViewport.getRenderedRange().start;
    }
}

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
        TableVirtualScrollModule,
        ScrollingModule,
        VirtualScrollIndexPipe,
        ValueListComponent,
        SelectColumnComponent,
    ],
})
export class Table2Component<T extends object, C extends object> {
    data = input<T[]>([]);
    treeData = input<TreeData<T, C>>();
    columns = input<Column2<T>[]>([]);
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });
    size = input(25, { transform: numberAttribute });
    maxSize = input(1000, { transform: numberAttribute });

    // Select
    rowSelectable = input(false, { transform: booleanAttribute });
    rowSelected = input<T[]>([]);
    rowSelectedChange = output<T[]>();
    selected = signal<T[]>([]);

    update = output<UpdateOptions>();
    more = output<UpdateOptions>();

    isTreeData = computed(() => !!this.treeData());
    treeInlineData = computed<{ value?: T; child?: object }[]>(() =>
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
    dataSource = new TableDataSource<T>();
    normColumns = computed<NormColumn<T>[]>(() => this.columns().map((c) => new NormColumn(c)));
    columnsData$$: Observable<{ value: Observable<Value>; isChild?: boolean }[][]> = combineLatest([
        toObservable(this.isTreeData),
        toObservable(this.treeInlineData),
        toObservable(this.data),
        toObservable(this.normColumns),
    ]).pipe(
        map(([isTree, inlineData, data, cols]) => {
            if (isTree) {
                return inlineData.map((d, idx) =>
                    cols.map((c) => ({
                        value: (d.child && c.child
                            ? c.child(d.child, idx)
                            : d.value
                              ? c.cell(d.value, idx)
                              : of<Value>({ value: '' })
                        ).pipe(shareReplay({ refCount: true, bufferSize: 1, windowTime: 30_000 })),
                        isChild: !d.value,
                    })),
                );
            }
            return data.map((d, idx) =>
                cols.map((c) => ({
                    value: c
                        .cell(d, idx)
                        .pipe(shareReplay({ refCount: true, bufferSize: 1, windowTime: 30_000 })),
                })),
            );
        }),
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

    displayedColumns = computed(() => [
        ...(this.rowSelectable() ? [this.columnDefs.select] : []),
        ...this.normColumns().map((c) => c.field),
    ]);
    columnDefs = COLUMN_DEFS;

    scrollViewport = viewChild('scrollViewport', { read: ElementRef });

    constructor(
        private dr: DestroyRef,
        private injector: Injector,
    ) {
        effect(
            () => {
                this.dataSource.data = (
                    this.isTreeData() ? this.treeInlineData() : this.data()
                ) as never;
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
        this.more.emit({ size: this.loadSize() });
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
            toObservable(this.normColumns, { injector: this.injector }).pipe(
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
        this.scrollViewport()?.nativeElement?.scrollTo?.(0, 0);
        this.update.emit({ size: this.loadSize() });
    }
}
