import { Component } from '@angular/core';

@Component({
    selector: 'v-table-actions',
    template: `
        <div fxLayout fxLayoutGap="16px">
            <ng-content></ng-content>
        </div>
    `,
})
export class TableActionsComponent {}
