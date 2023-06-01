import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MtxGrid } from '@ng-matero/extensions/grid/grid';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { coerceBoolean } from 'coerce-property';
import { get } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { TableActionsComponent } from './components/table-actions.component';
import { Column } from './types/column';
import { createMtxGridColumns } from './utils/create-mtx-grid-columns';
import { Progressable } from '../../types/progressable';
import { ComponentChanges } from '../../utils';

@UntilDestroy()
@Component({
    selector: 'v-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends object> implements OnInit, Progressable, OnChanges {
    @Input() data!: T[];
    @Input() columns!: Column<T>[];
    @Input() cellTemplate: MtxGrid['cellTemplate'] = undefined as never;
    @Input() trackBy: MtxGrid['trackBy'] = undefined as never;
    @Input() trackByField?: string;
    @Input() progress?: boolean | number | null = false;

    @Input() @coerceBoolean noActions: boolean | '' = false;

    @Input() @coerceBoolean rowSelectable: boolean | '' = false;
    @Input() rowSelected!: T[];
    @Output() rowSelectionChange = new EventEmitter<T[]>();

    @Input() sizes: boolean | number[] | string = false;
    @Input() size?: number;

    @Input() @coerceBoolean hasMore?: boolean | null | '' = false;
    @Output() more = new EventEmitter<{ size?: number }>();

    @Output() sizeChange = new EventEmitter<number>();
    @Output() update = new EventEmitter<{ size?: number }>();

    @Input() sortActive?: string;
    @Input() sortDirection?: SortDirection;
    @Output() sortChange = new EventEmitter<Sort>();

    @ContentChild(TableActionsComponent) actions!: TableActionsComponent;
    @ViewChild('cellTpl', { static: true }) defaultCellTemplate!: TemplateRef<unknown>;

    size$ = new BehaviorSubject<undefined | number>(undefined);
    renderedColumns!: MtxGridColumn<T>[];
    hasReset = false;

    renderedSizes: number[] = [];
    renderedCellTemplate!: MtxGrid['cellTemplate'];

    internalSelected: T[] = [];

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.size$
            .pipe(distinctUntilChanged(), untilDestroyed(this))
            .subscribe((v) => this.sizeChange.emit(v));
    }

    ngOnChanges(changes: ComponentChanges<TableComponent<T>>) {
        if (changes.columns) {
            this.updateColumns();
        }
        if (changes.sizes) {
            if (Array.isArray(this.sizes)) {
                this.renderedSizes = this.sizes;
            } else if (typeof this.sizes !== 'string' && !this.sizeChange.observed) {
                this.renderedSizes = [];
            } else {
                this.renderedSizes = [25, 100, 1000];
            }
            this.size$.next(this.renderedSizes[0]);
        }
        if (changes.size && this.size) {
            this.size$.next(this.size);
        }
        if (changes.cellTemplate) {
            this.updateCellTemplate();
        }
    }

    reset() {
        this.updateColumns();
        // TODO: Hack, problem with pinned columns rerender in mtx-grid
        this.renderedColumns.push({ field: ' ' });
        this.cdr.detectChanges();
        this.renderedColumns.pop();
    }

    updateColumns(columns?: MtxGridColumn<T>[]) {
        if (columns) {
            this.renderedColumns = columns;
            this.renderedColumns.forEach((c) => (c.hide = !c.show));
            this.hasReset = true;
        } else {
            this.renderedColumns = createMtxGridColumns(this.columns) as never;
            this.hasReset = false;
        }
        this.updateCellTemplate();
    }

    trackByFieldFn(index: number, item: T) {
        return get(item, this.trackByField ?? '');
    }

    private updateCellTemplate() {
        if (this.cellTemplate instanceof TemplateRef) {
            this.renderedCellTemplate = this.cellTemplate;
            return;
        }
        if (!this.cellTemplate && this.renderedColumns.every((c) => !c.cellTemplate)) {
            this.renderedCellTemplate = this.defaultCellTemplate;
            return;
        }
        this.renderedCellTemplate = Object.fromEntries(
            this.renderedColumns.map((c) => [
                c.field,
                this.cellTemplate?.[c.field as never] ?? c.cellTemplate ?? this.defaultCellTemplate,
            ])
        );
    }
}
