import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { TemplateColumn } from '../components/templates/templates';

export type ExtColumn<T> = MtxGridColumn<T> | TemplateColumn<T>;

export type Column<T> = ExtColumn<T> | string;
