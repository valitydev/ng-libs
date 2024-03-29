import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { SelectFn } from '../../../utils';

import { ColumnObject } from './column';

export type ColumnPinValue = 'left' | 'right' | null;

export type FormatterFn<TObject extends object, TResult = unknown> = SelectFn<
    TObject,
    TResult,
    [index: number, colDef: ColumnObject<TObject>]
>;
export type ColumnFn<TObject extends object, TResult = unknown> = (
    rowData: TObject,
    index: number,
) => TResult;

export interface BaseColumn<T extends object> {
    field: string;
    header?: string | Observable<string>;
    hide?: boolean;
    pinned?: ColumnPinValue;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    sortable?: boolean | string;
    cellTemplate?: TemplateRef<unknown>;
    formatter?: FormatterFn<T>;

    description?: FormatterFn<T>;

    tooltip?: FormatterFn<T>;

    link?: ColumnFn<T, string>;
    linkParameters?: { target?: '_blank' };

    click?: ColumnFn<T, void>;

    lazy?: boolean;

    // TODO: Need to delete
    type?: void;
}
