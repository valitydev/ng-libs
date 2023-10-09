import { OmitByValueExact } from 'utility-types';

import { Color } from '../../../styles';

import { BaseColumn, ColumnFn, FormatterFn } from './base-column';

export type TypedColumn<
    T extends object,
    TType extends string,
    TTypeParameters extends object = never,
> = Omit<BaseColumn<T>, 'type'> &
    OmitByValueExact<{ type: TType; typeParameters: TTypeParameters }, never>;

export type MenuColumn<T extends object> = TypedColumn<
    T,
    'menu',
    {
        items: {
            label: string;
            click: ColumnFn<T, void>;
        }[];
    }
>;
export type TagColumn<T extends object, TTag extends PropertyKey = PropertyKey> = TypedColumn<
    T,
    'tag',
    {
        label?: FormatterFn<T>;
        tags: Record<TTag, { label?: string; color?: Color }>;
    }
>;

export type TypedColumns<T extends object> =
    | TypedColumn<T, 'datetime'>
    | TypedColumn<T, 'currency', { currencyCode: FormatterFn<T>; isMinor?: boolean }>
    | TagColumn<T>
    | MenuColumn<T>
    | TypedColumn<T, 'boolean'>;
