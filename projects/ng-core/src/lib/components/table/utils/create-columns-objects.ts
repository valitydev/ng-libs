import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import startCase from 'lodash-es/startCase';

import { Column, ColumnObject } from '../types';

export function createColumnObject<T extends object>(col: Column<T>): ColumnObject<T> {
    const extCol: ColumnObject<T> = isObject(col) ? col : { field: col };
    if (isNil(extCol.header)) {
        extCol.header = startCase(String(extCol.field.split('.').at(-1)));
    }
    return extCol;
}

export function createColumnsObjects<T extends object>(columns: Column<T>[]): ColumnObject<T>[] {
    return columns?.map((col) => createColumnObject(col)) || [];
}
