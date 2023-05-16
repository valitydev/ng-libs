import { Directive, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, Validator } from '@angular/forms';
import { WrappedControlSuperclass } from '@s-libs/ng-core';
import { EMPTY, Observable } from 'rxjs';

import { getErrorsTree } from './utils/get-errors-tree';
import { getValue } from '../get-value';

@Directive()
export abstract class ValidatedControlSuperclass<OuterType, InnerType = OuterType>
    extends WrappedControlSuperclass<OuterType, InnerType>
    implements OnInit, Validator
{
    protected emptyValue!: InnerType;

    override ngOnInit() {
        this.emptyValue = getValue(this.control) as InnerType;
        super.ngOnInit();
    }

    validate(): ValidationErrors | null {
        return getErrorsTree(this.control);
    }

    protected override setUpOuterToInnerErrors$(
        _outer$: Observable<ValidationErrors>
    ): Observable<ValidationErrors> {
        return EMPTY;
    }

    protected override setUpInnerToOuterErrors$(
        _inner$: Observable<ValidationErrors>
    ): Observable<ValidationErrors> {
        return EMPTY;
    }

    protected override outerToInnerValue(outer: OuterType): InnerType {
        if ('controls' in this.control) {
            if (!outer) return this.emptyValue;
            if (
                Object.keys(outer).length < Object.keys((this.control as FormGroup).controls).length
            )
                return Object.assign({}, this.emptyValue, outer);
        }
        return outer as never;
    }
}
