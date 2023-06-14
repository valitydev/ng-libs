import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { Color } from '../../../styles';
import { SelectFn } from '../../../utils';

type FormatterFn<TObject extends object, TResult = unknown> = SelectFn<
    TObject,
    TResult,
    [colDef: ExtColumn<TObject>]
>;

type BaseColumn<T extends object> = Pick<
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
};

type TypedColumn<TType = never, TParams = never> = {
    type: TType;
} & Pick<
    {
        typeParameters: TParams;
    },
    TParams extends never ? never : 'typeParameters'
>;

export type TagColumn<T extends object, TTag extends PropertyKey = PropertyKey> = BaseColumn<T> &
    TypedColumn<
        'tag',
        {
            label?: FormatterFn<T>;
            tags: Record<TTag, { label?: string; color?: Color }>;
        }
    >;

export type ExtColumn<T extends object> = BaseColumn<T> &
    (
        | { type?: undefined }
        | TypedColumn<'datetime'>
        | TypedColumn<'currency', { currencyCode: FormatterFn<T>; isMinor?: boolean }>
        | TagColumn<T>
        | TypedColumn<
              'menu',
              {
                  items: {
                      label: string;
                      click: (rowData: T) => void;
                  }[];
              }
          >
        | TypedColumn<'boolean'>
    );

export type Column<T extends object> = ExtColumn<T> | string;
