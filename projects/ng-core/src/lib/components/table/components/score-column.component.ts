import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatSortHeader } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { BaseColumnComponent } from './base-column.component';

@Component({
    standalone: true,
    selector: 'v-score-column',
    template: `
        <ng-container [matColumnDef]="name()">
            <th *matHeaderCellDef [mat-sort-header]="name()" mat-header-cell style="display: none">
                Score
            </th>
            <td *matCellDef="let row; let index = index" mat-cell style="display: none">
                {{ scores().get(row)?.score | number: '1.2-2' : 'en' }}
            </td>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatTableModule, MatSortHeader],
})
export class ScoreColumnComponent<T extends object> extends BaseColumnComponent {
    scores = input<Map<T, { score: number }>>(new Map());
}
