import { Directive, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DEFAULT_DIALOG_CONFIG } from '../tokens';
import { DialogResponse } from '../types/dialog-response';
import { DialogResponseStatus } from '../types/dialog-response-status';

@Directive()
export class DialogSuperclass<
    TDialogComponent,
    TDialogData = void,
    TDialogResponseData = void,
    TDialogResponseStatus = void,
> {
    static defaultDialogConfig = DEFAULT_DIALOG_CONFIG.medium;

    dialogData: TDialogData = this.injector.get(MAT_DIALOG_DATA) as TDialogData;
    dialogRef = this.injector.get(MatDialogRef) as MatDialogRef<
        TDialogComponent,
        DialogResponse<TDialogResponseData, TDialogResponseStatus>
    >;

    constructor(private injector: Injector) {}

    closeWithCancellation(data?: TDialogResponseData) {
        this.dialogRef.close({
            status: DialogResponseStatus.Cancelled,
            data,
        } as never);
    }

    closeWithSuccess(data?: TDialogResponseData) {
        this.dialogRef.close({
            status: DialogResponseStatus.Success,
            data,
        } as never);
    }

    closeWithError(data?: TDialogResponseData) {
        this.dialogRef.close({
            status: DialogResponseStatus.Error,
            data,
        } as never);
    }
}
