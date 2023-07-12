import { Directive, OnInit } from '@angular/core';
import { ValidationErrors, Validator } from '@angular/forms';
import { WrappedControlSuperclass } from '@s-libs/ng-core';
import { EMPTY, Observable } from 'rxjs';

import { getErrorsTree } from './utils/get-errors-tree';

@Directive()
export abstract class AbstractControlSuperclass<OuterType, InnerType = OuterType>
    extends WrappedControlSuperclass<OuterType, InnerType>
    implements Validator, OnInit
{
    override ngOnInit() {
        super.ngOnInit();
        setTimeout(() => {
            if (this.control.invalid) {
                this.onValidatorChange();
            }
        }, 0);
    }

    validate() {
        return getErrorsTree(this.control);
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onValidatorChange = fn;
    }

    protected override setUpInnerToOuterErrors$(): Observable<ValidationErrors> {
        return EMPTY;
    }

    protected override setUpOuterToInnerErrors$(): Observable<ValidationErrors> {
        return EMPTY;
    }

    private onValidatorChange: () => void = () => undefined;
}
