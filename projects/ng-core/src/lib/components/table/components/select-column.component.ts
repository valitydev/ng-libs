import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    booleanAttribute,
    DestroyRef,
    OnInit,
    OnDestroy,
    OnChanges,
    output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { combineLatest } from 'rxjs';
import { startWith, map, shareReplay } from 'rxjs/operators';

import { ComponentChanges } from '../../../utils';

import { BaseColumnComponent } from './base-column.component';

@Component({
    standalone: true,
    selector: 'v-select-column',
    template: `
        <ng-container [matColumnDef]="name()" [sticky]="true">
            @let columnClasses = 'column';
            <th *matHeaderCellDef [class]="columnClasses" mat-header-cell>
                <mat-checkbox
                    [checked]="selection.hasValue() && (isAllSelected$ | async)"
                    [disabled]="!!progress() || (filtered() && !(isAllSelected$ | async))"
                    [indeterminate]="selection.hasValue() && !(isAllSelected$ | async)"
                    (change)="$event ? toggleAllRows() : null"
                >
                </mat-checkbox>
            </th>
            <td *matCellDef="let row" [class]="columnClasses" mat-cell>
                <mat-checkbox
                    [checked]="selection.isSelected(row)"
                    [disabled]="!!progress()"
                    (change)="$event ? selection.toggle(row) : null"
                    (click)="$event.stopPropagation()"
                >
                </mat-checkbox>
            </td>
            <td *matFooterCellDef [class]="columnClasses" mat-footer-cell>
                <mat-checkbox disabled></mat-checkbox>
            </td>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatTableModule, MatCheckboxModule],
    styles: `
        .column {
            padding-left: 4px;
            padding-right: 4px;
            width: 48px;
            border-right: 1px solid;
            text-overflow: clip;
        }
    `,
})
export class SelectColumnComponent<T extends object>
    extends BaseColumnComponent
    implements OnInit, OnDestroy, OnChanges
{
    selected = input<T[]>([]);
    selectedChange = output<T[]>();

    data = input<T[]>([]);
    progress = input<boolean | number | null | undefined>(false);
    filtered = input<boolean, unknown>(false, { transform: booleanAttribute }); // TODO: remove

    selection = new SelectionModel<T>(true, []);
    isAllSelected$ = combineLatest([
        this.selection.changed.pipe(startWith(null)),
        toObservable(this.data),
    ]).pipe(
        map(() => this.getIsAllSelected()),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    constructor(private dr: DestroyRef) {
        super();
    }

    override ngOnInit() {
        super.ngOnInit();
        this.selection.changed.pipe(takeUntilDestroyed(this.dr)).subscribe(() => {
            this.selectedChange.emit(this.selection.selected);
        });
    }

    ngOnChanges(changes: ComponentChanges<SelectColumnComponent<T>>) {
        if (changes.data || changes.selected) {
            this.updateSelection();
        }
    }

    toggleAllRows() {
        if (this.getIsAllSelected()) {
            this.selection.clear(true);
            return;
        }
        this.selection.select(...this.data());
    }

    private getIsAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.data().length;
        return numSelected === numRows;
    }

    private updateSelection() {
        const newSelected = (this.selected() || []).filter((d) => !!this.data()?.includes?.(d));
        this.selection.deselect(...this.selection.selected.filter((s) => !newSelected.includes(s)));
        this.selection.select(...newSelected);
    }
}
