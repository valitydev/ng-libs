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
    ElementRef,
    viewChild,
    OnInit,
    Injector,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, switchMap, debounceTime, fromEvent, skipWhile } from 'rxjs';
import { shareReplay, map, filter } from 'rxjs/operators';

import { ContentLoadingComponent } from '../../../content-loading';
import { ValueComponent } from '../../../value';
import { Column2, UpdateOptions, NormColumn } from '../../types';
import { TableDataSource } from '../../utils/table-data-source';
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
    ],
})
export class Table2Component<T extends object> implements OnInit {
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
    normalizedColumns = computed<NormColumn<T>[]>(() =>
        this.columns().map((c) => new NormColumn(c)),
    );
    columnsData$$ = combineLatest([
        toObservable(this.data),
        toObservable(this.normalizedColumns),
    ]).pipe(
        map(([data, cols]) =>
            cols.map((c) =>
                data.map((d, idx) =>
                    c.cell(d, idx).pipe(shareReplay({ refCount: true, bufferSize: 1 })),
                ),
            ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    columnsData$ = this.columnsData$$.pipe(
        switchMap((d) => combineLatest(d.map((v) => combineLatest(v)))),
        debounceTime(300),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    isPreload = signal(false);
    loadSize = computed(() => (this.isPreload() ? this.preloadSize() : this.size()));
    count = computed(() => this.data()?.length ?? 0);

    rowDefs = computed(() => this.normalizedColumns().map((c) => c.field));
    columnDefs = COLUMN_DEFS;
    scrolledTableWrapperEl = viewChild('scrolledTableWrapper', { read: ElementRef });
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

    ngOnInit() {
        toObservable(this.infinityScroll, { injector: this.injector })
            .pipe(
                filter(Boolean),
                switchMap(() =>
                    toObservable(this.scrolledTableWrapperEl, { injector: this.injector }),
                ),
                filter((el) => !!el?.nativeElement),
                switchMap((el) => fromEvent<Event>(el?.nativeElement, 'scroll')),
                debounceTime(500),
                skipWhile(() => this.progress()),
                takeUntilDestroyed(this.dr),
            )
            .subscribe((e) => {
                const el = e.target as HTMLElement;
                const buffer = el.clientHeight;
                if (el.scrollTop > el.scrollHeight - el.clientHeight - buffer) {
                    this.showMore();
                }
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
}
