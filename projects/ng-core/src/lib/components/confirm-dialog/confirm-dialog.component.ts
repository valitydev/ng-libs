import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DialogResponseStatus, DialogSuperclass } from '../dialog';

@Component({
    selector: 'v-action-dialog',
    templateUrl: 'confirm-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent extends DialogSuperclass<
    ConfirmDialogComponent,
    { title?: string; confirmLabel?: string; hasReason?: boolean; description?: string } | void,
    { reason?: string }
> {
    control = new FormControl<string>('', { nonNullable: true });

    cancel() {
        this.dialogRef.close({ status: DialogResponseStatus.Cancelled });
    }

    confirm() {
        this.dialogRef.close({
            status: DialogResponseStatus.Success,
            data:
                this.dialogData && this.dialogData.hasReason
                    ? { reason: this.control.value }
                    : undefined,
        });
    }
}
