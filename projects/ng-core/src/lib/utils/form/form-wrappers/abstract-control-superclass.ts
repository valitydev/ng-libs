import { ChangeDetectorRef, DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { WrappedControlSuperclass } from '@s-libs/ng-core';
import { concat, EMPTY, Observable, take, timer } from 'rxjs';
import { filter } from 'rxjs/operators';

import { getErrorsTree } from './utils/get-errors-tree';

@Directive()
export abstract class AbstractControlSuperclass<OuterType, InnerType = OuterType>
    extends WrappedControlSuperclass<OuterType, InnerType>
    implements Validator, OnInit
{
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    override ngOnInit() {
        super.ngOnInit();
        concat(timer(0), timer(100))
            .pipe(
                filter(() => this.control.invalid),
                take(1),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.onValidatorChange();
                this.cdr.markForCheck();
            });
    }

    validate(_control: AbstractControl): ValidationErrors | null {
        return getErrorsTree(this.control); //|| getErrorsTree(_control);
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
