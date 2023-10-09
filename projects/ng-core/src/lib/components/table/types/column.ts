import { BaseColumn } from './base-column';
import { TypedColumns } from './typed-column';

export type ColumnObject<T extends object> = BaseColumn<T> | TypedColumns<T>;
export type Column<T extends object> = ColumnObject<T> | string;
