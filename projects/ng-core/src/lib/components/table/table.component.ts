import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ContentChild,
    OnChanges,
    ChangeDetectorRef,
    TemplateRef,
} from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { MtxGridColumn, MtxGridCellTemplate } from '@ng-matero/extensions/grid';
import { MtxGrid } from '@ng-matero/extensions/grid/grid';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { coerceBoolean } from 'coerce-property';
import { BehaviorSubject } from 'rxjs';

import { TableActionsComponent } from './components/table-actions.component';
import { Column, ExtColumn } from './types/column';
import { createGridColumns } from './utils/create-grid-columns';
import { Progressable } from '../../types/progressable';
import { ComponentChanges } from '../../utils';

@UntilDestroy()
@Component({
    selector: 'v-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, Progressable, OnChanges {
    @Input() data!: T[];
    @Input() columns!: Column<T>[];
    @Input() cellTemplate: MtxGrid['cellTemplate'] = undefined as never;
    @Input() trackBy: MtxGrid['trackBy'] = undefined as never;
    @Input() progress?: boolean | number | null = false;

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

    size$ = new BehaviorSubject<undefined | number>(undefined);
    renderedColumns!: MtxGridColumn<T>[];
    hasReset = false;

    menuCellTpl!: TemplateRef<unknown>;
    descriptionCellTpl!: TemplateRef<unknown>;

    renderedSizes: number[] = [];
    renderedCellTemplate!: MtxGrid['cellTemplate'];

    constructor(private cdr: ChangeDetectorRef) {}

    get hasUpdate() {
        return this.update.observed;
    }

    get hasSizes() {
        return this.renderedSizes.length;
    }

    get inProgress() {
        return !!this.progress;
    }

    ngOnInit() {
        this.size$.pipe(untilDestroyed(this)).subscribe((v) => this.sizeChange.emit(v));
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
            this.renderedColumns = columns.slice();
            this.renderedColumns.forEach((c) => (c.hide = c.hide ?? !c.show));
            this.hasReset = true;
        } else {
            this.renderedColumns = createGridColumns(this.columns) as never;
            this.hasReset = false;
        }
        this.updateCellTemplate();
    }

    private updateCellTemplate() {
        if (this.cellTemplate instanceof TemplateRef) this.renderedCellTemplate = this.cellTemplate;
        this.renderedCellTemplate = {
            ...(this.renderedColumns as ExtColumn<T>[]).reduce((acc, c) => {
                switch (c.type) {
                    case 'menu':
                        acc[c.field] = this.menuCellTpl;
                        break;
                    case 'description':
                        acc[c.field] = this.descriptionCellTpl;
                        break;
                }
                return acc;
            }, {} as MtxGridCellTemplate),
            ...(this.cellTemplate || {}),
        } as MtxGridCellTemplate;
    }
}
