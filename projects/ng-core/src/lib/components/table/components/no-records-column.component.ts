import { ChangeDetectionStrategy, Component, input, booleanAttribute } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { BaseColumnComponent } from './base-column.component';

@Component({
    standalone: true,
    selector: 'v-no-records-column',
    template: `
        <ng-container [matColumnDef]="name()">
            <td *matFooterCellDef class="no-records mat-body-1" colSpan="99999" mat-footer-cell>
                {{ progress() ? 'Loading...' : 'No records' }}
            </td>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTableModule],
    styles: `
        .no-records {
            text-align: center;
            height: calc(52px * 3);
        }
    `,
})
export class NoRecordsColumnComponent extends BaseColumnComponent {
    progress = input(false, { transform: booleanAttribute });
}
