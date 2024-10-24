import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActionsModule } from '../../actions';

@Component({
    selector: 'v-table-actions',
    standalone: true,
    template: `
        <v-actions>
            <ng-content></ng-content>
        </v-actions>
    `,
    imports: [ActionsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableActionsComponent {}
