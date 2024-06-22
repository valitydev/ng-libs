import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    effect,
    computed,
    DestroyRef,
    booleanAttribute,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { combineLatest, switchMap, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ValueComponent, Value } from '../../../value';
import { Column2, NormalizedColumn2, normalizeColumns } from '../../types';
import { createInternalColumnDef } from '../../utils/create-internal-column-def';
import { NoRecordsColumnComponent } from '../no-records-column.component';
import { ProgressBarComponent } from '../progress-bar.component';

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
        ProgressBarComponent,
        NoRecordsColumnComponent,
    ],
})
export class Table2Component<T extends object> {
    data = input<T[]>([]);
    columns = input<Column2<T>[]>([]);
    progress = input(false, { transform: booleanAttribute });

    dataSource = new MatTableDataSource<T>();
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

    rowDefs = computed(() => this.normalizedColumns().map((c) => c.field));
    columnDefs = {
        noRecords: createInternalColumnDef('no-records'),
    };
    footerRowDefs = computed(() => (this.data()?.length ? [] : [this.columnDefs.noRecords]));

    constructor(private dr: DestroyRef) {
        effect(() => {
            this.dataSource.data = this.data();
        });
    }
}
