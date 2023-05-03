import { Component, Input, Output, EventEmitter, OnInit, ContentChild } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MtxGrid } from '@ng-matero/extensions/grid/grid';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { coerceBoolean } from 'coerce-property';
import { BehaviorSubject } from 'rxjs';

import { TableActionsComponent } from './components/table-actions.component';

@UntilDestroy()
@Component({
    selector: 'v-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {
    @Input() data!: T[];
    @Input() columns!: MtxGridColumn<T>[];
    @Input() cellTemplate: MtxGrid['cellTemplate'] = undefined as never;
    @Input() trackBy: MtxGrid['trackBy'] = undefined as never;
    @Input() @coerceBoolean loading = false;

    @Input() @coerceBoolean rowSelectable = false;
    @Output() rowSelectionChange = new EventEmitter<T[]>();

    @Input() sizes: boolean | number[] = false;

    @Output() sizeChange = new EventEmitter<number>();
    @Output() update = new EventEmitter<{ size?: number }>();
    @Output() more = new EventEmitter<{ size?: number }>();

    @ContentChild(TableActionsComponent) actions!: TableActionsComponent;

    size$ = new BehaviorSubject<undefined | number>(25);

    get hasUpdate() {
        return this.update.observed;
    }

    get hasMore() {
        return this.more.observed && this.columns;
    }

    get hasToolbar() {
        return this.hasUpdate || this.actions;
    }

    get hasSizes() {
        return this.sizesList.length;
    }

    get sizesList() {
        if (Array.isArray(this.sizes)) return this.sizes;
        if (typeof this.sizes !== 'string' && !this.sizeChange.observed) return [];
        return [25, 50, 100];
    }

    ngOnInit() {
        this.size$.pipe(untilDestroyed(this)).subscribe((v) => this.sizeChange.emit(v));
    }
}
