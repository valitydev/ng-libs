import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MtxGridModule } from '@ng-matero/extensions/grid';

import { TableActionsComponent } from './components/table-actions.component';
import { TableMenuCellTemplateComponent } from './components/table-menu-cell-template.component';
import { TableTooltipCellTemplateComponent } from './components/table-tooltip-cell-template.component';
import { TableComponent } from './table.component';
import { ActionsModule } from '../actions';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ActionsModule,
        MatTooltipModule,
        MtxGridModule,
    ],
    declarations: [
        TableComponent,
        TableActionsComponent,
        TableTooltipCellTemplateComponent,
        TableMenuCellTemplateComponent,
    ],
    exports: [TableComponent, TableActionsComponent, TableTooltipCellTemplateComponent],
})
export class TableModule {}
