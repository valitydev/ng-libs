import { AbstractControl } from '@angular/forms';

export function setDisabled(
    control?: AbstractControl,
    disabled: boolean = true,
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
) {
    if (!control) return;
    if (disabled) control.disable(options);
    else control.enable(options);
}
