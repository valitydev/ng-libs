import { ComponentType } from '@angular/cdk/overlay';
import { Inject, Injectable, Optional } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DEFAULT_DIALOG_CONFIG, DIALOG_CONFIG, DialogConfig } from '../tokens';
import { DialogResponse } from '../types/dialog-response';
import { DialogSuperclass } from '../utils/dialog-superclass';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    constructor(
        private dialog: MatDialog,
        @Optional()
        @Inject(DIALOG_CONFIG)
        private readonly dialogConfig: DialogConfig
    ) {
        if (!dialogConfig) this.dialogConfig = DEFAULT_DIALOG_CONFIG;
    }

    open<C, D, R, S>(
        dialogComponent: ComponentType<DialogSuperclass<C, D, R, S>>,
        /**
         *  Workaround when both conditions for the 'data' argument must be true:
         *  - typing did not require passing when it is optional (for example: {param: number} | void)
         *  - typing required to pass when it is required (for example: {param: number})
         */
        ...[data, configOrConfigName]: D extends void
            ? []
            : [data: D, configOrConfigName?: Omit<MatDialogConfig<D>, 'data'> | keyof DialogConfig]
    ): MatDialogRef<C, DialogResponse<R, S>> {
        let config: Partial<MatDialogConfig<D>>;
        if (!configOrConfigName) config = {};
        else if (typeof configOrConfigName === 'string')
            config = this.dialogConfig[configOrConfigName];
        else config = configOrConfigName;

        return this.dialog.open(dialogComponent as never, {
            data,
            ...(dialogComponent as typeof DialogSuperclass).defaultDialogConfig,
            ...config,
        });
    }
}
