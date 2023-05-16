import { Directive } from '@angular/core';
import { ValidationErrors, FormControl } from '@angular/forms';
import { WrappedControlSuperclass } from '@s-libs/ng-core';
import { EMPTY, Observable } from 'rxjs';

@Directive()
export class ValidatedFormControlSuperclass<
    OuterType,
    InnerType = OuterType
> extends WrappedControlSuperclass<OuterType, InnerType> {
    // TODO: Validation sometimes doesn't work (is not forwarded higher by nesting) with Angular FormControl
    control = new FormControl() as FormControl<InnerType>;

    validate(): ValidationErrors | null {
        return this.control.errors;
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
}
