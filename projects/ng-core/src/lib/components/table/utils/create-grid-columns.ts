import { formatDate } from '@angular/common';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import startCase from 'lodash-es/startCase';

import { Column, ObjectColumn } from '../types/column';

export function createGridColumn<T>(col: Column<T>): ObjectColumn<T> {
    const resCol: ObjectColumn<T> = isObject(col) ? col : { field: col };
    if (isNil(resCol.header)) resCol.header = startCase(String(resCol.field.split('.').at(-1)));
    return resCol;
}

export function createGridColumns<T>(columns: Column<T>[]): ObjectColumn<T>[] {
    return columns.map((col) => createGridColumn(col));
}

export function createDescriptionFormatterColumn<T>(
    field: string,
    getDescriptionOrDescriptionField: ((data: T) => string) | string,
    getValue?: (data: T) => string
): ObjectColumn<T> {
    return {
        field,
        formatter: (data: T) => {
            const desc =
                typeof getDescriptionOrDescriptionField === 'function'
                    ? getDescriptionOrDescriptionField(data)
                    : String(data[getDescriptionOrDescriptionField as keyof T]);
            const value = getValue ? getValue(data) : String(data[field as keyof T]);
            return (
                value + (desc ? `<div class="mat-caption mat-secondary-text">${desc}</div>` : '')
            );
        },
    };
}

export const createDatetimeFormatter =
    <T>(selectorOrField: keyof T | ((data: T) => string | number | Date)) =>
    (data: T) =>
        formatDate(
            (typeof selectorOrField === 'function'
                ? selectorOrField(data)
                : data[selectorOrField]) as never,
            'dd.MM.yyyy HH:mm:ss',
            'en'
        );

export function createDatetimeFormatterColumn<T>(field: string): ObjectColumn<T> {
    return {
        field,
        formatter: createDatetimeFormatter<T>(field as keyof T),
    };
}
