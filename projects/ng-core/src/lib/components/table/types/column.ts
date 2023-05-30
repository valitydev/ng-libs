import { ThemePalette } from '@angular/material/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { SelectFn } from '../../../utils';

type FormatterFn<T extends object> = SelectFn<T, unknown, [colDef: ExtColumn<T>]>;

export type BaseExtColumn<T extends object, TType = never, TTypeParams = never> = Pick<
    MtxGridColumn<T>,
    'field' | 'header' | 'cellTemplate'
> & {
    formatter?: FormatterFn<T>;
    description?: FormatterFn<T>;
    tooltip?: FormatterFn<T>;
    type: TType;
    typeParameters: TTypeParams;
};

export type ExtColumn<T extends object> =
    | BaseExtColumn<T>
    | BaseExtColumn<T, 'datetime'>
    | BaseExtColumn<T, 'currency', { currencyCode: FormatterFn<T> }>
    | BaseExtColumn<
          T,
          'tag',
          {
              tags: Record<
                  PropertyKey,
                  { label?: string; color?: 'success' | 'pending' | ThemePalette }
              >;
          }
      >
    | BaseExtColumn<
          T,
          'menu',
          {
              items: {
                  label: string;
                  click: (rowData: T) => void;
              }[];
          }
      >;

export type Column<T extends object> = ExtColumn<T> | string;
