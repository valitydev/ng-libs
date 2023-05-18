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
