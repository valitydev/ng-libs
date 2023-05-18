import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { DescriptionColumn } from '../components/table-description-cell-template.component';
import { MenuColumn } from '../components/table-menu-cell-template.component';
import { TagColumn } from '../components/table-tag-cell-template.component';

export type ExtColumn<T> = MtxGridColumn<T> | MenuColumn<T> | DescriptionColumn<T> | TagColumn<T>;

export type Column<T> = ExtColumn<T> | string;
