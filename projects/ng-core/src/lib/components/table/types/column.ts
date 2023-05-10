import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { MenuColumn } from '../components/table-menu-cell-template.component';

export type ObjectColumn<T> = MtxGridColumn<T> | MenuColumn<T>;

export type Column<T> = ObjectColumn<T> | string;
