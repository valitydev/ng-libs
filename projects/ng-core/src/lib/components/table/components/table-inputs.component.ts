import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'v-table-inputs',
    standalone: true,
    template: `<ng-content></ng-content>`,
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableInputsComponent {}
