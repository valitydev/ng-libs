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

    @coerceBoolean @Input() disabled = false;
    @coerceBoolean @Input() inProgress = false;
    @Input() progress?: number;

    @coerceBoolean @Input() hasDivider = true;

    @coerceBoolean @Input() noContent = false;
    @coerceBoolean @Input() noActions = false;

    @Output() cancel = new EventEmitter<void>();

    cancelData = {
        status: DialogResponseStatus.Cancelled,
    };

    cancelDialog(): void {
        this.cancel.emit();
    }
}
