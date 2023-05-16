import _isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';

export function isEmptyPrimitive(value: unknown): boolean {
    return isNil(value) || value === '';
}

export function isEmpty(value: unknown): boolean {
    return isObject(value)
        ? value.constructor === Object && _isEmpty(value)
        : isEmptyPrimitive(value);
}
