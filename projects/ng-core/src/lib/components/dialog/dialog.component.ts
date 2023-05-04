import { Component, EventEmitter, Input, Output } from '@angular/core';
import { coerceBoolean } from 'coerce-property';

import { DialogResponseStatus } from './types/dialog-response-status';

@Component({
    selector: 'v-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss'],
})
export class DialogComponent {
    @Input() title!: string;

    @coerceBoolean @Input() disabled: boolean | string = false;
    @coerceBoolean @Input() inProgress: boolean | string = false;
    @Input() progress?: number;

    @coerceBoolean @Input() hasDivider: boolean | string = true;

    @coerceBoolean @Input() noContent: boolean | string = false;
    @coerceBoolean @Input() noActions: boolean | string = false;
    @coerceBoolean @Input() noCloseButton: boolean | string = false;

    @Output() cancel = new EventEmitter<void>();

    cancelData = {
        status: DialogResponseStatus.Cancelled,
    };

    cancelDialog(): void {
        this.cancel.emit();
    }
}
