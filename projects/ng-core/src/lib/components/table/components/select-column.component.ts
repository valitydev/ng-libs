import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    booleanAttribute,
    Output,
    EventEmitter,
    DestroyRef,
    OnInit,
    OnDestroy,
    OnChanges,
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
        <ng-container [sticky]="true" matColumnDef>
            <th *matHeaderCellDef class="pinned-left" mat-header-cell>
                <mat-checkbox
                    [checked]="selection.hasValue() && (isAllSelected$ | async)"
                    [disabled]="!!progress() || (filtered() && !(isAllSelected$ | async))"
                    [indeterminate]="selection.hasValue() && !(isAllSelected$ | async)"
                    (change)="$event ? toggleAllRows() : null"
                >
                </mat-checkbox>
            </th>
            <td *matCellDef="let row" class="pinned-left" mat-cell>
                <mat-checkbox
                    [checked]="selection.isSelected(row)"
                    [disabled]="!!progress()"
                    (change)="$event ? selection.toggle(row) : null"
                    (click)="$event.stopPropagation()"
                >
                </mat-checkbox>
            </td>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatTableModule, MatCheckboxModule],
})
export class SelectColumnComponent<T extends object>
    extends BaseColumnComponent
    implements OnInit, OnDestroy, OnChanges
{
    selected = input<T[]>([]);
    @Output() selectedChange = new EventEmitter<T[]>();

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

    constructor(private destroyRef: DestroyRef) {
        super();
    }

    override ngOnInit() {
        super.ngOnInit();
        this.selection.changed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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
