import { AbstractControl } from '@angular/forms';
import omitBy from 'lodash-es/omitBy';
import { filter, map } from 'rxjs/operators';

import { isEmptyPrimitive } from '../empty/is-empty-primitive';

import { getFormValueChanges } from './get-form-value-changes';

export function getValidValueChanges(control: AbstractControl, predicate = isEmptyPrimitive) {
    return getFormValueChanges(control, true).pipe(
        filter(() => control.valid),
        map((value) => omitBy(value, predicate)),
    );
}
