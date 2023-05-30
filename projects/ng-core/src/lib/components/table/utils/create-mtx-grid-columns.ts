import { MtxGridColumn } from '@ng-matero/extensions/grid';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import startCase from 'lodash-es/startCase';

import { Column } from '../types/column';

export function createMtxGridColumn<T extends object>(col: Column<T>): MtxGridColumn<T> {
    const extCol: MtxGridColumn<T> = isObject(col) ? (col as MtxGridColumn<T>) : { field: col };
    if (isNil(extCol.header)) {
        extCol.header = startCase(String(extCol.field.split('.').at(-1)));
    }
    return extCol;
}

export function createMtxGridColumns<T extends object>(columns: Column<T>[]): MtxGridColumn<T>[] {
    return columns?.map((col) => createMtxGridColumn(col)) || [];
}
