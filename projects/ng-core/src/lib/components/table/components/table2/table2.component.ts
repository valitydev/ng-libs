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
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { combineLatest, switchMap, forkJoin, take, Observable } from 'rxjs';
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
    ],
})
export class Table2Component<T extends object> {
    data = input<T[]>([]);
    columns = input<Column2<T>[]>([]);
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });
    size = input(25, { transform: numberAttribute });
    preloadSize = input(1000, { transform: numberAttribute });
    infinityScroll = input(false, { transform: booleanAttribute });

    update = output<UpdateOptions>();
    more = output<UpdateOptions>();

    dataSource = new TableDataSource<T>();
    normColumns = computed<NormColumn<T>[]>(() => this.columns().map((c) => new NormColumn(c)));
    columnsData$$ = combineLatest([toObservable(this.data), toObservable(this.normColumns)]).pipe(
        map(([data, cols]) =>
            data.map((d, idx) =>
                cols.map((c) =>
                    c.cell(d, idx).pipe(shareReplay({ refCount: true, bufferSize: 1 })),
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
    loadSize = computed(() => (this.isPreload() ? this.preloadSize() : this.size()));
    count = computed(() => this.data()?.length ?? 0);

    rowDefs = computed(() => this.normColumns().map((c) => c.field));
    columnDefs = COLUMN_DEFS;
    hasLoadingContentFooter = computed(() => this.infinityScroll() && this.hasMore());

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
        effect(() => {
            this.dataSource.paginator.setSize(this.size());
        });
    }

    load() {
        if (this.isPreload()) {
            this.isPreload.set(false);
        }
        this.update.emit({ size: this.loadSize() });
        this.dataSource.paginator.reload();
    }

    preload() {
        if (this.isPreload() && this.hasMore()) {
            this.more.emit({ size: this.loadSize() });
        } else {
            this.isPreload.set(true);
            this.update.emit({ size: this.loadSize() });
            this.dataSource.paginator.reload();
        }
    }

    showMore() {
        this.dataSource.paginator.more();
        if (this.hasMore() && this.dataSource.paginator.length > this.count()) {
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
            toObservable(this.normColumns, { injector: this.injector }).pipe(
                switchMap((cols) => forkJoin(cols.map((c) => c.header.pipe(take(1))))),
            ),
            this.columnsData$.pipe(take(1)),
        ]).pipe(map(([cols, data]) => createCsv(tableToCsvObject(cols, data))));
    }
}
