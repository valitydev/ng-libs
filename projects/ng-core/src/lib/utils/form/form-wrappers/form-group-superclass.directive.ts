import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AbstractControlSuperclass } from './abstract-control-superclass';
import { getValue } from '../get-value';

@Directive()
export abstract class FormGroupSuperclass<OuterType, InnerType = OuterType>
    extends AbstractControlSuperclass<OuterType, InnerType>
    implements OnInit
{
    protected emptyValue!: InnerType;

    override ngOnInit() {
        this.emptyValue = getValue(this.control) as InnerType;
        super.ngOnInit();
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
