import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { OmitByValue } from 'utility-types';

import { Color } from '../../../styles';
import { SelectFn } from '../../../utils';

type FormatterFn<TObject extends object, TResult = unknown> = SelectFn<
    TObject,
    TResult,
    [colDef: ExtColumn<TObject>]
>;
type ColumnFn<TObject extends object, TResult = unknown> = (
    rowData: TObject,
    index: number,
) => TResult;

export type BaseColumn<
    T extends object,
    TType extends string | undefined = undefined,
    TTypeParameters extends object = never,
> = Pick<
    MtxGridColumn<T>,
    | 'field'
    | 'header'
    | 'cellTemplate'
    | 'hide'
    | 'pinned'
    | 'maxWidth'
    | 'minWidth'
    | 'width'
    | 'sortable'
> & {
    formatter?: FormatterFn<T>;
    description?: FormatterFn<T>;
    tooltip?: FormatterFn<T>;
    link?: ColumnFn<T, string>;
} & (TType extends void
        ? { type?: TType }
        : OmitByValue<{ type: TType; typeParameters: TTypeParameters }, never>);

export type MenuColumn<T extends object> = BaseColumn<
    T,
    'menu',
    {
        items: {
            label: string;
            click: ColumnFn<T, void>;
        }[];
    }
>;
export type TagColumn<T extends object, TTag extends PropertyKey = PropertyKey> = BaseColumn<
    T,
    'tag',
    {
        label?: FormatterFn<T>;
        tags: Record<TTag, { label?: string; color?: Color }>;
    }
>;

export type ExtColumn<T extends object> =
    | BaseColumn<T>
    | BaseColumn<T, 'datetime'>
    | BaseColumn<T, 'currency', { currencyCode: FormatterFn<T>; isMinor?: boolean }>
    | TagColumn<T>
    | MenuColumn<T>
    | BaseColumn<T, 'boolean'>;

export type Column<T extends object> = ExtColumn<T> | string;
