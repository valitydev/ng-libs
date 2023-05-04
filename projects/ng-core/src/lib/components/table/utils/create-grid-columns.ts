import { formatDate } from '@angular/common';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import isObject from 'lodash-es/isObject';
import startCase from 'lodash-es/startCase';

import { Column } from '../types/column';

export function createGridColumn<T>(col: Column<T>) {
    if (!isObject(col))
        col = {
            field: col as string,
        };
    if (!col.header) col.header = startCase(String(col.field.split('.').at(-1)));
    return {
        ...col,
    };
}

export function createGridColumns<T>(columns: Column<T>[]): MtxGridColumn<T>[] {
    return columns.map((col) => createGridColumn(col));
}

export function createDescriptionFormatterColumn<T>(
    field: string,
    getDescriptionOrDescriptionField: ((data: T) => string) | string,
    getValue?: (data: T) => string
): MtxGridColumn {
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

export function createDatetimeFormatterColumn<T>(field: string): MtxGridColumn {
    return {
        field,
        formatter: createDatetimeFormatter<T>(field as keyof T),
    };
}
