import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { MenuColumn } from '../components/table-menu-cell-template.component';

export type ExtColumn<T> = MtxGridColumn<T> | MenuColumn<T>;

export type Column<T> = ExtColumn<T> | string;
