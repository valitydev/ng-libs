import { ValidationErrors } from '@angular/forms';
import { WrappedControlSuperclass } from '@s-libs/ng-core';
import isEqual from 'lodash-es/isEqual';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { hasControls } from '../has-controls';

import { getErrorsTree } from './utils/get-errors-tree';

export abstract class AbstractControlSuperclass<
    OuterType,
    InnerType = OuterType
> extends WrappedControlSuperclass<OuterType, InnerType> {
    override setDisabledState(isDisabled: boolean): void {
        // If the form group control is disabled, then it turns it on during initialization
        if (hasControls(this.control)) {
            return;
        }
        super.setDisabledState(isDisabled);
    }

    protected override setUpInnerToOuterErrors$(
        inner$: Observable<ValidationErrors>
    ): Observable<ValidationErrors> {
        return inner$.pipe(
            switchMap(() => this.control.statusChanges.pipe(startWith(this.control.status))),
            map(() => getErrorsTree(this.control) || {}),
            distinctUntilChanged(isEqual)
        );
    }

    protected override setUpOuterToInnerErrors$(
        _outer$: Observable<ValidationErrors>
    ): Observable<ValidationErrors> {
        return EMPTY;
    }
}
