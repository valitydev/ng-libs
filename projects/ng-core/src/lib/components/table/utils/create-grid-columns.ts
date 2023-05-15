import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import startCase from 'lodash-es/startCase';

import { Column, ExtColumn } from '../types/column';

export function createGridColumn<T>(col: Column<T>): ExtColumn<T> {
    const extCol: ExtColumn<T> = isObject(col) ? col : { field: col };
    if (isNil(extCol.header)) {
        extCol.header = startCase(String(extCol.field.split('.').at(-1)));
    }
    switch (extCol.type) {
        case 'date':
            if (!extCol.typeParameter?.format) {
                if (!extCol.typeParameter) extCol.typeParameter = {};
                extCol.typeParameter.format = 'dd.MM.yyyy HH:mm:ss';
            }
            break;
    }

    return extCol;
}

export function createGridColumns<T>(columns: Column<T>[]): ExtColumn<T>[] {
    return columns?.map((col) => createGridColumn(col)) || [];
}

export function createDescriptionFormatterColumn<T>(
    field: string,
    getDescriptionOrDescriptionField: ((data: T) => string) | string,
    getValue?: (data: T) => string
): ExtColumn<T> {
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
