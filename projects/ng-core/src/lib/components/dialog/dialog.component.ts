import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { coerceBoolean } from 'coerce-property';

import { Progressable } from '../../types/progressable';

import { DialogResponseStatus } from './types/dialog-response-status';

@Component({
    selector: 'v-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss'],
})
export class DialogComponent implements Progressable {
    @HostBinding('class.v-dialog') hostClass: boolean = true;

    @Input() title!: string;

    @coerceBoolean @Input() disabled: boolean | string = false;
    @Input() progress?: Progressable['progress'];

    @coerceBoolean @Input() hasDivider: boolean | string = true;

    @coerceBoolean @Input() noContent: boolean | string = false;
    @coerceBoolean @Input() noActions: boolean | string = false;
    @coerceBoolean @Input() noCloseButton: boolean | string = false;

    @Output() cancel = new EventEmitter<void>();

    get progressMode() {
        return typeof this.progress === 'number' && this.progress > 1
            ? 'determinate'
            : 'indeterminate';
    }

    get progressValue(): number {
        return this.progressMode === 'determinate'
            ? (this.progress as number)
            : (undefined as never);
    }

    cancelData = {
        status: DialogResponseStatus.Cancelled,
    };

    cancelDialog(): void {
        this.cancel.emit();
    }
}
