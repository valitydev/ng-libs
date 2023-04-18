import { Directive, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DEFAULT_DIALOG_CONFIG } from '../tokens';
import { DialogResponse as TDialogResponse } from '../types/dialog-response';
import { DialogResponseStatus } from '../types/dialog-response-status';

@Directive()
export class DialogSuperclass<
    DialogComponent,
    DialogData = void,
    DialogResponseData = void,
    DialogResponseStatus = void,
    DialogResponse = TDialogResponse<DialogResponseData, DialogResponseStatus>
> {
    static defaultDialogConfig = DEFAULT_DIALOG_CONFIG.medium;

    dialogData: DialogData = this.injector.get(MAT_DIALOG_DATA) as DialogData;
    dialogRef = this.injector.get(MatDialogRef) as MatDialogRef<DialogComponent, DialogResponse>;

    constructor(private injector: Injector) {}

    closeWithCancellation(data?: DialogResponseData) {
        this.dialogRef.close({
            status: DialogResponseStatus.Cancelled,
            data,
        } as never);
    }

    closeWithSuccess(data?: DialogResponseData) {
        this.dialogRef.close({
            status: DialogResponseStatus.Success,
            data,
        } as never);
    }

    closeWithError(data?: DialogResponseData) {
        this.dialogRef.close({
            status: DialogResponseStatus.Error,
            data,
        } as never);
    }
}
