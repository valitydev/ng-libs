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
import { combineLatest, Observable, switchMap, take, forkJoin } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { downloadFile, createCsv } from '../../../../utils';
import { ContentLoadingComponent } from '../../../content-loading';
import { ValueComponent } from '../../../value';
import { Column2, UpdateOptions, NormColumn } from '../../types';
import { TableDataSource } from '../../utils/table-data-source';
import { tableToCsvObject } from '../../utils/table-to-csv-object';
import { InfinityScrollDirective } from '../infinity-scroll.directive';
import { NoRecordsColumnComponent } from '../no-records-column.component';
import { ShowMoreButtonComponent } from '../show-more-button/show-more-button.component';
import { TableInfoBarComponent } from '../table-info-bar.component';
import { TableProgressBarComponent } from '../table-progress-bar.component';

import { COLUMN_DEFS } from './consts';

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
        NoRecordsColumnComponent,
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
    ],
})
export class Table2Component<T extends object> {
    data = input<T[]>([]);
    columns = input<Column2<T>[]>([]);
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });
    size = input(25, { transform: numberAttribute });
    maxSize = input(1000, { transform: numberAttribute });
    infinityScroll = input(false, { transform: booleanAttribute });

    update = output<UpdateOptions>();
    more = output<UpdateOptions>();

    dataSource = new TableDataSource<T>();
    normColumns = computed<NormColumn<T>[]>(() => this.columns().map((c) => new NormColumn(c)));
    columnsData$$ = combineLatest([toObservable(this.data), toObservable(this.normColumns)]).pipe(
        map(([data, cols]) =>
            data.map((d, idx) =>
                cols.map((c) =>
                    c
                        .cell(d, idx)
                        .pipe(shareReplay({ refCount: true, bufferSize: 1, windowTime: 30_000 })),
                ),
            ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$ = this.columnsData$$.pipe(
        switchMap((d) => combineLatest(d.map((v) => combineLatest(v)))),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    isPreload = signal(false);
    loadSize = computed(() => (this.isPreload() ? this.maxSize() : this.size()));
    count = computed(() => this.data()?.length);

    rowDefs = computed(() => this.normColumns().map((c) => c.field));
    columnDefs = COLUMN_DEFS;
    hasLoadingContentFooter = computed(() => this.infinityScroll() && this.hasMore());

    scrollViewport = viewChild('scrollViewport', { read: ElementRef });

    constructor(
        private dr: DestroyRef,
        private injector: Injector,
    ) {
        effect(
            () => {
                this.dataSource.data = this.data();
            },
            {
                // TODO: not a necessary line, but after adding viewChild signal requires
                allowSignalWrites: true,
            },
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
