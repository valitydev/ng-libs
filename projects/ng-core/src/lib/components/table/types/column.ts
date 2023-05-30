import { ThemePalette } from '@angular/material/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { SelectFn } from '../../../utils';

type FormatterFn<T extends object> = SelectFn<T, unknown, [colDef: ExtColumn<T>]>;
type TypedColumn<T = never, P = never> = {
    type: T;
} & Pick<
    {
        typeParameters: P;
    },
    P extends never ? never : 'typeParameters'
>;

export type ExtColumn<T extends object> = Pick<
    MtxGridColumn<T>,
    'field' | 'header' | 'cellTemplate'
> & {
    formatter?: FormatterFn<T>;
    description?: FormatterFn<T>;
    tooltip?: FormatterFn<T>;
} & (
        | { type?: undefined }
        | TypedColumn<'datetime'>
        | TypedColumn<'currency', { currencyCode: FormatterFn<T> }>
        | TypedColumn<
              'tag',
              {
                  tags: Record<
                      PropertyKey,
                      { label?: string; color?: 'success' | 'pending' | ThemePalette }
                  >;
              }
          >
        | TypedColumn<
              'menu',
              {
                  items: {
                      label: string;
                      click: (rowData: T) => void;
                  }[];
              }
          >
    );

export type Column<T extends object> = ExtColumn<T> | string;
