import { DescriptionColumn } from './table-description-cell-template.component';
import { MenuColumn } from './table-menu-cell-template.component';
import { TagColumn } from './table-tag-cell-template.component';

export type TemplateColumn<T> = MenuColumn<T> | DescriptionColumn<T> | TagColumn<T>;
