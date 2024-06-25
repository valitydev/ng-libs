import { AsyncPipe } from '@angular/common';
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
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, switchMap, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ValueComponent, Value } from '../../../value';
import { Column2, NormalizedColumn2, normalizeColumns, UpdateOptions } from '../../types';
import { createInternalColumnDef } from '../../utils/create-internal-column-def';
import { TableDataSource } from '../../utils/table-data-source';
import { NoRecordsColumnComponent } from '../no-records-column.component';
import { ShowMoreButtonComponent } from '../show-more-button/show-more-button.component';
import { TableInfoBarComponent } from '../table-info-bar.component';
import { TableProgressBarComponent } from '../table-progress-bar.component';

@Component({
    standalone: true,
    selector: 'v-table2',
    templateUrl: './table2.component.html',
    styleUrls: ['./table2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatTableModule,
        MatCardModule,
        ValueComponent,
        AsyncPipe,
        TableProgressBarComponent,
        NoRecordsColumnComponent,
        TableInfoBarComponent,
        ShowMoreButtonComponent,
    ],
})
export class Table2Component<T extends object> {
    data = input<T[]>([]);
    columns = input<Column2<T>[]>([]);
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });
    size = input(25, { transform: numberAttribute });
    preloadSize = input(1000, { transform: numberAttribute });

    update = output<UpdateOptions>();
    more = output<UpdateOptions>();

    dataSource = new TableDataSource<T>();
    normalizedColumns = computed<NormalizedColumn2<T>[]>(() => normalizeColumns(this.columns()));
    columnsData$: Observable<Value[][]> = combineLatest([
        toObservable(this.data),
        toObservable(this.normalizedColumns),
    ]).pipe(
        switchMap(([data, cols]) =>
            combineLatest(cols.map((c) => combineLatest(data.map((d, idx) => c.cell(d, idx))))),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    isPreload = signal(false);
    loadSize = computed(() => (this.isPreload() ? this.preloadSize() : this.size()));
    count = computed(() => this.data()?.length ?? 0);

    rowDefs = computed(() => this.normalizedColumns().map((c) => c.field));
    columnDefs = {
        noRecords: createInternalColumnDef('no-records'),
    };
    footerRowDefs = computed(() => (this.data()?.length ? [] : [this.columnDefs.noRecords]));

    constructor(private dr: DestroyRef) {
        effect(() => {
            this.dataSource.data = this.data();
        });
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
}
