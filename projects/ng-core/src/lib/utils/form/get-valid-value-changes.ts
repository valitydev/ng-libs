import { AbstractControl } from '@angular/forms';
import omitBy from 'lodash-es/omitBy';
import { filter, map } from 'rxjs/operators';

import { getFormValueChanges } from './get-form-value-changes';
import { isEmptyPrimitive } from '../is-empty-primitive';

export function getValidValueChanges(control: AbstractControl, predicate = isEmptyPrimitive) {
    return getFormValueChanges(control, true).pipe(
        filter(() => control.valid),
        map((value) => omitBy(value, predicate))
    );
}
