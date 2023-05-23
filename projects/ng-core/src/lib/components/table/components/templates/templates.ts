import {
    CurrencyColumn,
    TableCurrencyCellTemplateComponent,
} from './table-currency-cell-template.component';
import {
    DescriptionColumn,
    TableDescriptionCellTemplateComponent,
} from './table-description-cell-template.component';
import { MenuColumn, TableMenuCellTemplateComponent } from './table-menu-cell-template.component';
import { TableTagCellTemplateComponent, TagColumn } from './table-tag-cell-template.component';
import {
    TableTooltipCellTemplateComponent,
    TooltipColumn,
} from './table-tooltip-cell-template.component';

export type TemplateColumn<T> =
    | MenuColumn<T>
    | DescriptionColumn<T>
    | TagColumn<T>
    | TooltipColumn<T>
    | CurrencyColumn<T>;

export const TEMPLATE_COMPONENTS = [
    TableTooltipCellTemplateComponent,
    TableMenuCellTemplateComponent,
    TableDescriptionCellTemplateComponent,
    TableTagCellTemplateComponent,
    TableCurrencyCellTemplateComponent,
];
